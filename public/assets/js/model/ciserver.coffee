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
@CiServer =
  sanitiseContextRoot: (contextRoot) ->
    # Replace hashes with nothing, and percentage encoding with actual slash.
    cleanContextRoot = contextRoot.replace(/\#/, "").replace("%2F", "/")

    # Add a starting slash unless it already has one.
    cleanContextRoot = "/" + cleanContextRoot unless cleanContextRoot.match(/^\//)

    # Remove double slashes; globally.
    cleanContextRoot = cleanContextRoot.replace(/\/\//g, "/")

    # if it's just a slash left, provide an empty string.
    if cleanContextRoot == "/" then "" else cleanContextRoot

  addHttp: (url) ->
    if not url.match(/http\:\/\//) and not url.match(/https\:\/\//)
      url = 'http://' + url

    return url

  url: (host, port, contextRoot, apiPath, user = false, pass = false) ->
    # Cover the cases where we have bad input. Specifically, no host means
    # we should provide false.
    return false if host == ""
    if host == "" and port == "" and contextRoot == "" and apiPath == ""
      return false

    prefix = ''
    if host.match(/https\:\/\//)
      host = host.replace(/https\:\/\//, '')
      prefix = 'https://'
    else if host.match(/http\:\/\//)
      host = host.replace(/http\:\/\//, '')
      prefix = 'http://'

    # Build up the URL given the inputs we have provided.
    suffix = host + ":" + port + @sanitiseContextRoot(contextRoot) + apiPath

    # If username/password not provided or are empty, do nothing.
    if user == false or pass == false or user == "" or pass == ""
      url = suffix
    else
      url = user + ":" + pass + "@" + suffix

    return @addHttp(prefix + url)

  find: (url, parser, app) ->
    $.jsonp
      # No need to have any kind of cache turned on. Each request should
      # be fresh.
      cache: false
      pageCache: false
      url: url
      dataType: "jsonp"
      data: ""
      async: false # Important because of user/pass requirement.
      success: parser
      timeout: 10000
      traditional: true
      error: ->
        CONFIG.request_in_progress = false
        host = CONFIG.host + ":" + CONFIG.port + CONFIG.context
        app.renderFlash "error", "Couldn't connect to server #{host}"
        projects.emptyProjects()
      complete: (data) ->
        CONFIG.request_in_progress = false
