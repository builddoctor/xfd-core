@TeamCity =
  name: "teamcity"
  defaultUri: "/"
  defaultHost: "localhost"
  defaultPort: 8111
  url: (config) ->
    CiServer.url config.host, config.port, config.context, "/app/json/api/json?jsonp=?"

  parse: (json) ->
    Hudson.parse json
