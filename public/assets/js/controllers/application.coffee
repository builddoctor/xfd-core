class @ApplicationController
  renderJob: (id, job) ->
    job.id = id

    if job.color == "red"
      job.face = "&#9785;" # Unhappy face
      job.faceclass = "redface"
    else if job.color == "grey"
      job.face = "&#10008;" # Cross (X)
      job.faceclass = "greyface"
    else if job.color == "building"
      job.face = "&#8987;" # Hourglass
      job.faceclass = "buildingface"
    else
      job.face = "&#9786;" # Smiley face
      job.faceclass = "greenface"

    return new EJS(url: "/assets/js/views/project.ejs").render job

    # Below is the progress bar stuff that's broken at the moment...

    # No need to load up extra HTML/CSS for all projects. Just those
    # that are building need to have the progress bar.
    #if job.color == "building"
    #  job.progress = BuildMonitor.jobProgressBar(job.progress)
    #  return new EJS(url: "/assets/js/views/project_building.ejs").render job
    #else
    #  return new EJS(url: "/assets/js/views/project.ejs").render job

  # This accepts a string as the message text and a severity class. The
  # severity class can be one of the following:
  #  - notice
  #  - warning
  #  - error
  renderFlash: (severity = false, text = false) ->
    if severity == false or severity == "" or text == false or text == ""
      return false

    if severity not in ['notice', 'warning', 'error']
      return false

    # Clear the element contents and classes
    @clearFlash()

    container = $("#flash-container")

    # Add our content and show the flash notice.
    container.addClass severity
    container.html text
    container.show()
    true

  clearFlash: ->
    container = $("#flash-container")

    # Calling removeClass() directly will remove all classes.
    container.removeClass()
    container.html ""
    container.hide()
    true

  clearLocalStorage: (clearAll = false) ->
    for key of window.localStorage
      # if the key doesn't have our localStorage prefix.
      if key.indexOf(CONFIG.localStoragePrefix) is -1 or clearAll is true
        window.localStorage.removeItem(key)
