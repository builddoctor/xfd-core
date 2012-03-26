# eXtreme Feedback Device (XFD) is a Build Radiator for Continuous
# Integration servers. Copyright (C) 2010-2012 The Build Doctor Limited.
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.
@Hudson =
  fail: 0
  success: 0
  disable: 0
  name: "hudson"
  defaultUri: "/hudson"
  defaultHost: document.location.hostname
  defaultPort: document.location.port
  isFirstIteration: true

  url: (config) ->
    CiServer.url config.host, config.port, config.context, "/api/json?jsonp=?", config.username, config.password

  parse: (json) ->
    result = {}
    result.jobs = {}

    $.each json.jobs, (id, job) ->
      color = Hudson.getState(job.color)
      prog = 0
      if CONFIG.engine.name is "hudson" and color is "red"
        Hudson.renderMetadata(job.url, job.name)
      # TODO: This is where it's breaking! It looks as though the AJAX calls aren't getting through: Hudson.getData. There's also related code in application.coffee to look at.
      #if color == "building"
      #  prog = Hudson.getProgress(job.url)
      result.jobs[id] =
        name: job.name
        url: job.url
        color: color
        progress: prog
    result

  # Use this to parse jobs that are currently being built -- color:
  # blue_anime or building. This produces a json output with just
  # the relevant sections left.
  parseJob: (url) ->
    json = Hudson.getData(url, null, true)
    result =
      timestamp: json.timestamp,
      difference: Date.now() - json.timestamp

  getState: (color) ->
    if color is "blue" or color is "green"
      state = "green"
    else if color is "red"
      state = "red"
    else if color.endsWith("_anime")
      state = "building"
    else
      state = "grey"
    state

  # Get the duration of an already completed build
  getLastDuration: (url) ->
    json = Hudson.getData(url, null, true);
    json.duration

  getProgress: (url) ->
    # Get the URLs of our builds
    jobInfo = Hudson.getData(url, null, true)
    duration = Hudson.getLastDuration(jobInfo.lastBuild.url)
    currentBuild = Hudson.parseJob(jobInfo.builds[0].url)
    currentBuild.difference / duration

  getData: (url, func, silentFail = true) ->
    fullUrl = url + 'api/json'
    $.jsonp
      cache: false
      pageCache: false
      callbackParameter: "jsonp"
      url: fullUrl
      dataType: "jsonp"
      data: ""
      async: true
      success: func
      timeout: 25000
      traditional: false
      error: ->
        app = new ApplicationController()
        app.renderFlash "error", "Couldn't connect to url '#{url}' during Hudson data collection." if not silentFail
        projects.emptyProjects() if not silentFail
      complete: (data) ->
        data

  renderMetadata: (url, name) ->
    name = encodeURIComponent(name)
    Hudson.getData(url, Hudson.projectCallback(name), true)

  # Start of the callback section.
  #
  # These callbacks are passed onto Hudson.getData() to parse the resulting
  # JSON and text status that it provides. After completion each calls down
  # to the next set of data that needs to be grabbed, or exits silently.
  #
  # The reason for the silent exit is because of the async nature of the
  # network requests which need to be caught from within the $.jsonp method
  # call instead of the success() callback, which these three are.

  projectCallback: (name) ->
    (json, status) ->
      if json is null or json.lastBuild is null or json.lastBuild.url is null
        return false
      obj =
        project: json
      last = json.lastBuild.url
      window.localStorage.setItem(name, JSON.stringify(obj));
      Hudson.getData(last, Hudson.buildCallback(name), true)

  buildCallback: (name) ->
    if name is null
      return false
    n = name
    (json, status) ->
      obj = JSON.parse(window.localStorage.getItem(n))
      obj.lastBuild = json
      window.localStorage.setItem(n, JSON.stringify(obj));
      culprit = json.culprits[0].absoluteUrl + "/"
      Hudson.getData(culprit, Hudson.userCallback(n), true)

  userCallback: (name) ->
    if name is null
      return false
    n = name
    (json, status) ->
      property = undefined
      for field in json.property
        if field.address
          obj = JSON.parse(window.localStorage.getItem(n))
          obj.email = field.address
          window.localStorage.setItem(n, JSON.stringify(obj))

          # Add the gravatar inline.
          name = decodeURIComponent(n)
          elem = $("a:contains(\"#{name}\")")
          return false if elem.length is 0

          md5email = MD5(obj.email)
          img = "<img class=\"gravatar\" src=\"http://www.gravatar.com/avatar/#{md5email}?s=30\" />"
          elem.parent().prepend(img)
