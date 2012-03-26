@options =
  key: "com.builddoctor.xfd"
  def: "nothing saved!"
  errorfunc: ->
    alert "Sorry, looks like your browser doesn't support local storage"

@CONFIG =
  versionCheckInterval: 360000
  version: null
  request_in_progress: false
  engine: null
  host: null
  saveCount: 0
  localStoragePrefix: "buildxfd."

  selectEngine: (name) ->
    switch name
      when "hudson"
        engine = Hudson
      when "cruisecontrol"
        engine = CruiseControl
      when "teamcity"
        engine = TeamCity
      when "cctray" or "cruisecontrol.net" or "cruisecontrol.rb" or "cruisecontrol-dashboard" or "go"
        engine = CCTray
      else
        engine = Hudson
    engine

  save: ->
    saveHelper = (name, val) ->
      n = CONFIG.localStoragePrefix + name
      window.localStorage.removeItem(n)
      window.localStorage.setItem(n, val)

    saveHelper("username", @username)
    saveHelper("password", @password)
    saveHelper("host", @host)
    saveHelper("port", @port)
    saveHelper("engine", @engineName)
    saveHelper("context", @context)
    saveHelper("interval", @interval)
    saveHelper("username", @username)
    saveHelper("password", @password)

    @saveCount = @saveCount + 1

  loadForm: ->
    names = ["host", "port", "engine", "context", "interval", "username", "password"]

    for name in names
      n = CONFIG.localStoragePrefix + name
      v = window.localStorage.getItem(n)
      $("input[name=\"" + name + "\"]").val(v)

  lookupUrlParam: (param) ->
    $.url.param param

  lookupFormParam: (param) ->
    $("input[name=\"" + param + "\"]").val()

  lookupParam: (param, defaultValue) ->
    url = CONFIG.lookupUrlParam(param)
    form = CONFIG.lookupFormParam(param)

    # There should at least be a slash when an empty context
    # is provided to prevent bad URL formation.
    if param == "context" and form == ""
      form = "/"

    if form != "" and typeof form != "undefined" and form != defaultValue
      val = form
    else
      val = url

    if typeof val == "undefined"
      defaultValue
    else
      val

  init: (projects = false) ->
    if @engine != null and @engine != Hudson and @engine != undefined
      # nothing, we've already got it.
    else if projects == false
      name = CONFIG.lookupParam("engine", "hudson")
      @engine = CONFIG.selectEngine(name)
    else if projects != false
      # if projects is false, then we've manually submitted the form.
      name = $("#engine option:selected").text()
      @engine = CONFIG.selectEngine(name)
    else
      @engine = Hudson
    engine = @engine
    @engineName = engine.name
    @host = CONFIG.lookupParam("host", engine.defaultHost)
    @port = CONFIG.lookupParam("port", engine.defaultPort)
    @context = CONFIG.lookupParam("context", engine.defaultUri).replace(/%2F/, "")
    @interval = CONFIG.lookupParam("interval", 30)
    @username = CONFIG.lookupParam("username", false)
    @password = CONFIG.lookupParam("password", false)
    if projects != false
      CONFIG.save()
      projects.render()
