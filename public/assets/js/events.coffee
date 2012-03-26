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
# TODO: Refactor this; with respective test.
# Needs to be global for spec/javascripts/events.js to pass.
@lookup = (name, value) ->
  defaults = $.parseJSON("{ \"teamcity\": {\"context\": \"/\", \"port\":\"8180\"}, \"cruisecontrol\": {\"context\": \"/cruisecontrol\", \"port\":\"8080\"}, \"hudson\": {\"context\": \"/hudson\", \"port\": \"8080\"}, \"go\": {\"context\": \"/go/cctray.xml\", \"port\":\"8080\"}, \"cruisecontrol-dashboard\": {\"context\": \"/dashboard/cctray.xml\", \"port\":\"8080\"}, \"cruisecontrol.net\": {\"context\": \"/ccnet/XmlStatusReport.aspx\", \"port\":\"80\"}, \"cruisecontrol.rb\": {\"context\": \"/XmlStatusReport.aspx\", \"port\": 8080}}")
  defaults[name][value]

set_config_value = (name, param) ->
  selector = "#" + param
  urlParam = $.url.param("context")
  suggestion = lookup(name, param)
  if suggestion != "undefined"
    configValue = suggestion
  else configValue = param  if urlParam != "undefined"
  $(selector).val configValue

documentationClickHandler = (ev) ->
  ev.stopPropagation()
  $("#config").hide()
  true

configClickHandler = (ev) ->
  ApplicationController::clearFlash()
  ev.stopPropagation()
  $.facebox ajax: "config.html"
  CONFIG.loadForm() if CONFIG.saveCount >= 1
  $("#doc").hide()
  setTimeout (->
    $("#host-field").val CONFIG.host
    $("#port").val CONFIG.port
    $("#context").val CONFIG.context
    $("#interval").val CONFIG.interval
    $("#engine").val CONFIG.engine
    $("select").change ->
      name = $(this).val()
      set_config_value name, "context"
      set_config_value name, "port"
  ), 1000
  mpq.track("Opened config form")
  true

if mpq is undefined
  mpq =
    track: ->
      null

$(document).ready ->
  ApplicationController::clearLocalStorage(true)

  # main timer that we expect to overwrite.
  projectsRenderTimer = ""

  # build out objects
  versions = new VersionController
  buildMonitor = new BuildMonitorController
  projects = new ProjectController

  $.facebox.settings.loadingImage = "/assets/images/loading.gif"
  $("a[rel*=facebox]").facebox()
  queryString = $.query
  docButton = $("#doc-button")
  confButton = $("#conf-button")
  docButton.bind "click", documentationClickHandler
  confButton.bind "click", configClickHandler

  CONFIG.init()
  projects.renderStats()
  buildMonitor.renderStatusBar()
  projects.render()

  versions.checkVersion()
  versions.renderVersion()

  mpq.track("Started up XFD")

  # Setup timers.
  projectsRenderTimer = setInterval (->
    projects.render()
  ), (CONFIG.interval * 1000)

  versionTimer = setInterval (->
    versions.checkVersion()
    versions.renderVersion()
  ), CONFIG.versionCheckInterval

  projectsUpdateTimer = setInterval (->
    projects.updateTimeSince()
  ), 10000 # Update every 10 seconds.

  window.setupForm = ->
    CONFIG.init(projects)
    $(document).trigger('close.facebox')

    mpq.track("Submitted confirm form (KTHX)")

    # Clear the interval on form submission.
    clearInterval(projectsRenderTimer)
    projectsRenderTimer = setInterval (->
      projects.render()
    ), (CONFIG.interval * 1000)
