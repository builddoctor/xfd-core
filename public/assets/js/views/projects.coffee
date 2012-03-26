@projects =
  emptyProjects: ->
    $("#projects").empty()

  notify: (id, message) ->
    projects.emptyProjects()
    $("<li><h3 id=\"" + id + "\"></h3></li>").text(message).appendTo "#projects"
