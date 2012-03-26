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
class @ProjectController
  constructor: ->
    @app = new ApplicationController()
    @util = new Util()

    @project_list = $("ul#projects")

    # build the "last built" timer DOM object and respective Date object.
    @date = new Date()
    @date_elem = $("<li id=\"timeSince\" class=\"left\"></li>")
    @date_elem.insertBefore("li#project-stats")
    @updateTimeSince()

    @firstFilter = false
    @filter_elem = $("<li id=\"filter\" class=\"left\"><form><fieldset><input type=\"text\" name=\"filter\" value=\"filter...\" onclick=\"this.value=\'\'\"/></fieldset></form></li>")
    @filter_elem.insertBefore("li#timeSince")
    @setupFilterEvents()

  render: ->
    # we're starting to render again, so clear any notices, warnings, or
    # errors that may have appeared previously.
    @app.clearFlash()
    @app.clearLocalStorage()

    # Update the last checked date, so that @updateTimeSince() has something
    # new to look at.
    @date = new Date()
    @updateTimeSince()

    if CONFIG.request_in_progress == false
      CONFIG.request_in_progress = true
      if Hudson.isFirstIteration
        host = CONFIG.host + ":" + CONFIG.port + CONFIG.context
        if host.indexOf("xfd.build-doctor.com") == -1
          projects.notify "notice", "Connecting to #{host}... "
        else
          projects.notify "notice", "Connecting..."
        Hudson.isFirstIteration = false
      CiServer.find CONFIG.engine.url(CONFIG), ProjectController::renderJobs, @app

  # Renders a given job onto the page. If bad input is provided, or the
  # required element for appending is not present, false is returned. On
  # successfully completion, true is returned.
  renderJob: (id = false, job = false) ->
    if id == false or id == "" or job == false or job == ""
      return false

    container = $("div#container ul#projects")
    return false if container.length == 0

    renderedJob = ApplicationController::renderJob(id, job)
    container.append renderedJob
    true

  renderJobs: (json, text_status) ->
    projects.emptyProjects()
    parsed = CONFIG.engine.parse(json)
    jobs = parsed.jobs

    for type in ["building", "red", "green", "grey"]
      ProjectController::selectAndRenderJobs jobs, type

    ProjectController::renderStats()

  selectAndRenderJobs: (jobs = false, color = false) ->
    if jobs == false or jobs == "" or color == false or color == ""
      return false

    $.each jobs, (id, job) ->
      job.color = (if (job.color == "blue") then "green" else job.color)
      ProjectController::renderJob id, job if job.color == color or job.color == "green" and color == "green"
    true

  renderStats: ->
    BuildMonitor.collectStats()
    if $("#project-stats").length > 0
      $("#project-stats").empty()
      stats = new EJS(url: "/assets/js/views/stats.ejs").render(BuildMonitor)
      $("#project-stats").append stats
    $("div#status-bar").empty()
    BuildMonitorController::renderStatusBar()

  updateTimeSince: ->
    since = @util.timeSince(@date)
    @date_elem.text("Last updated: " + since)

  setupFilterEvents: ->
    @filter_elem.focus ->
      if $(this).val() is $(this).data("default_val") or not $(this).data("default_val")
        $(this).data "default_val", $(this).val()
        $(this).val ""

    @filter_elem.blur ->
      $(this).val $(this).data("default_val") if $(this).val() is ""

    @filter_elem.keyup =>
      @filterProjects()
    true

  # Filter the projecst list to show only those that contain 's'.
  filterProjects: =>
    s = @filter_elem.find("input").val()
    children = @project_list.children()

    # Track whether this feature is being used; only on first hit.
    if @firstFilter == false
      @firstFilter = true

    if s.length == 0
      children.filter((index) -> true).show()

    children.filter((index) ->
      return false if s.length < 1
      $(this).text().toLowerCase().indexOf(s) == -1
    ).hide()

    children.filter((index) ->
      return false if s.length < 1
      $(this).text().toLowerCase().indexOf(s) != -1
    ).show()

    true
