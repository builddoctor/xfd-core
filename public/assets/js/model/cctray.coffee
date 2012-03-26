@CCTray =
  name: "cctray"
  defaultUri: "/dashboard/cctray.xml"
  defaultHost: "localhost"
  defaultPort: 6969
  url: (config) ->
    CiServer.url CCTray.defaultHost, CCTray.defaultPort, "", "/" + config.host + ":" + config.port + CiServer.sanitiseContextRoot(config.context) + "?jsonp=?"

  parse: (json) ->
    Hudson.parse json
