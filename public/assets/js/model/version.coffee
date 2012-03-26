@VERSION = find: (callback) ->
  $.ajax
    url: "/version"
    dataType: "json"
    cache: false
    success: callback
