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
@CruiseControl =
  name: "cruisecontrol"
  defaultUri: "/cruisecontrol"
  defaultHost: "localhost"
  defaultPort: 8080
  context: (radiate) ->
    if radiate.context.match(/^%2F/)
      context = radiate.context.replace("%2F", "/")
    else if "/" != radiate.context.charAt(0)
      context = "/" + radiate.context
    else if "/" == radiate.context
      context = ""
    else
      context = radiate.context
    context

  url: (config) ->
    if null == config
      "http://localhost:8080/cruisecontrol/jsonp.jsp?jsonp=?"
    else
      CiServer.url config.host, config.port, config.context, "/jsonp.jsp?jsonp=?"

  lookup: (color) ->
    switch color
      when "passed"
        result = "green"
      when "failed"
        result = "red"
      when "unknown"
        result = "grey"
      else
        result = "grey"
    result

  parse: (json) ->
    result = {}
    result.jobs = {}
    $.each json.jobs, (id, job) ->
      result.jobs[id] =
        name: job.name
        url: job.url
        color: CruiseControl.lookup(job.color)

    result
