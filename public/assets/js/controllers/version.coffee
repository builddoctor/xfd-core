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
class @VersionController
  constructor: ->
    @app = new ApplicationController()

  renderVersion: ->
    callback = (data) ->
      versionNumber = data.version
      if versionNumber
        versionData = $("#app-version")
        if versionData.length
          versionData.val versionNumber
        else
          versionData = $("<input class=\"app-version\" id=\"app-version\" type=\"hidden\" value=\"" + versionNumber + "\"/>")
          versionData.appendTo "body"
        $("#version-string").text versionNumber
        $("#friendly-version").text versionNumber.substring(0, 10)

    VERSION.find callback

  checkVersionResults: (data = false) =>
    return false if data is false
    getCurrentVersion = ->
      if $("input#app-version").length
        $("input#app-version").val()
      else
        null
    loadedVersion = data.version
    currentVersion = getCurrentVersion()
    @app.renderFlash("warning", "A newer version is available: refresh this page to fetch it") if @checkVersionDifference(currentVersion, loadedVersion)
    true

  checkVersion: ->
    VERSION.find @checkVersionResults

  parseVersionString: (str) ->
    return false unless typeof (str) is "string"
    x = str.split(".")
    # parse from string or default to 0 if can't parse
    maj = parseInt(x[0]) or 0
    min = parseInt(x[1]) or 0
    pat = parseInt(x[2]) or 0
    result =
      major: maj
      minor: min
      patch: pat

  checkVersionDifference: (a, b) ->
    running_version = @parseVersionString(a)
    latest_version = @parseVersionString(b)
    if running_version.major < latest_version.major
      return true
    else if running_version.minor < latest_version.minor or running_version.patch < latest_version.patch
      return true
    else
      return false
