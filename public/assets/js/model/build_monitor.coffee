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
@BuildMonitor =
  collectStats: ->
    BuildMonitor.successCount = $(".job.green").length
    BuildMonitor.failCount = $(".job.red").length
    BuildMonitor.disableCount = $(".job.grey").length
    BuildMonitor.totalCount = BuildMonitor.successCount + BuildMonitor.failCount + BuildMonitor.disableCount

  quantise: ->
    calculate = (kind) ->
      return 0  if kind == 0
      ratio = kind / BuildMonitor.totalCount
      Math.round ratio * BuildMonitor.resolution

    red = calculate(BuildMonitor.failCount)
    green = calculate(BuildMonitor.successCount)
    delta = ((red + green) - BuildMonitor.resolution)
    green -= delta  if delta > 0
    grey = BuildMonitor.resolution - green - red
    red: red
    green: green
    grey: grey

  # Takes a percentage complete of the progress of a given job and produces
  # the relevant HTML to be provided to the view. Percentage complete
  # should be represented as a decimal, e.g. 0.8 == 80%.
  jobProgressBar: (complete) ->
    # Round to integers
    green = Math.round(complete * 10) / 10
    red = Math.round((1 - green) * 10)
    green = green * 10
    i = 0
    container = ""
    while i < BuildMonitor.resolution
      segmentColor = ""
      if green > 0
        segmentColor = "gray"
        green -= 1
      else if red > 0
        segmentColor = "light-gray"
        red -= 1
      segment = "<div class=\"progress-bar-element-" + i.toString() + " progress-bar-element " + segmentColor + "-bar\"></div>"
      i += 1
      container = container + segment
    return container
