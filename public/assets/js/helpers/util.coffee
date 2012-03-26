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
# Extend the String.prototype to include an "endsWith" function.
#
# This method can be used to find out if a string ends with another
# string.
#
# An Example:
#  - "blue_anime".endsWith("_anime");
#
# Reasons why this is better than Regex:
#  - Doesn't create a substring
#  - Uses native indexOf function for fastest results
#  - Skip unnecessary comparisons using the second parameter of
#    indexOf to skip ahead
#  - Works in Internet Explorer (tested on 7 through 9)
#  - NO Regex complications
String::endsWith = (suffix) ->
  @indexOf(suffix, @length - suffix.length) isnt -1

# Strips whitespace from a given string.
String::trim = ->
  @replace /^\s+|\s+$/g, ""

class @Util
  # Accepts a Date() object as input and converts it into the relative
  # string time compared to the current time.
  timeSince: (date) ->
    delta = Math.round((new Date - date) / 1000)
    minute = 60
    hour = minute * 60
    day = hour * 24
    week = day * 7
    fuzzy = undefined
    if delta < 30
      fuzzy = "just now"
    else if delta < minute
      fuzzy = delta + " seconds ago"
    else if delta < 2 * minute
      fuzzy = "a minute ago"
    else if delta < hour
      fuzzy = Math.floor(delta / minute) + " minutes ago"
    else if Math.floor(delta / hour) is 1
      fuzzy = "1 hour ago"
    else if delta < day
      fuzzy = Math.floor(delta / hour) + " hours ago"
    else fuzzy = "yesterday"  if delta < day * 2

    fuzzy = "over a day ago" if fuzzy == undefined
    fuzzy

  # converts a given email address into the equivalent hash required
  # to build out the image href.
  gravatarHash: (email) ->
    MD5(email.trim().toLowerCase())

  # Memoizer of functions!
  #
  # Takes a function (func) and hash (memo) as input. The hash ID isn't
  # required as it's found from the parameter input to the function. The
  # parameter will only be used on invocation. Recursive calls to the
  # passed function (func) will not be memoized.
  #
  # To invalidate the cache, just clear the hash that is passed to the
  # created function.
  #
  # Example usage:
  #   util = new Util()
  #   memo = {}
  #   fib = (n) ->
  #     (if n < 2 then n else fib(n - 1) + fib(n - 2))
  #   fastFib = util.memoize(fib, memo)
  memoize: (func, memo, hasher) ->
    identity = (value) ->
      value

    hasher or (hasher = identity)
    ->
      key = hasher.apply(this, arguments)
      (if hasOwnProperty.call(memo, key) then memo[key] else (memo[key] = func.apply(this, arguments)))
