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
class @BuildMonitorController
  constructor: ->
    BuildMonitor.resolution = 10
    BuildMonitor.totalCount = 0
    BuildMonitor.successCount = 10
    BuildMonitor.failCount = 0
    BuildMonitor.disableCount = 0
    BuildMonitor.collectStats()
    BuildMonitorController::renderStatusBar()

  renderStatusBar: ->
    container = $("div#container div#status-bar")
    quantised = BuildMonitor.quantise()
    total = BuildMonitor.resolution / BuildMonitor.totalCount
    red = BuildMonitor.failCount * total
    green = BuildMonitor.successCount * total
    i = 0
    while i < BuildMonitor.resolution
      if green > 0
        segmentColor = "green"
        green -= 1
      else if red > 0
        segmentColor = "red"
        red -= 1
      segment = $("<div id=\"status-bar-element-" + i + "\" class=\"status-bar-element " + segmentColor + "-bar\"></div>")
      segment.appendTo container
      i += 1
