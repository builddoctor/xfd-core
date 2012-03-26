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
