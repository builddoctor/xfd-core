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
