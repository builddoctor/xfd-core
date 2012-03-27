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
require 'rubygems'
require 'test/unit'
require 'rack/test'

require 'sinatra_server'

ENV['RACK_ENV'] = 'test'

class XFDTest < Test::Unit::TestCase
  include Rack::Test::Methods

  def app
    XFD
  end

  def test_hudson_fake
    get '/hudson/api/json?jsonp=jsonp1319189481138'
    expected_resp = 'jsonp1319189481138({"assignedLabels":[{}],"mode":"NORMAL","nodeDescription":"the master Hudson node","nodeName":"","numExecutors":2,"description":null,"jobs":[{"name":"Broken Build","url":"http://example.org/job/Broken%20Build/","color":"red"},{"name":"Clean Build","url":"http://example.org/job/Clean%20Build/","color":"blue"}],"overallLoad":{},"primaryView":{"name":"All","url":"http://example.org/"},"slaveAgentPort":0,"useCrumbs":false,"useSecurity":false,"views":[{"name":"All","url":"http://example.org/"}]})'
    assert_equal expected_resp, last_response.body
  end

  def test_hudson_job_fake
    get '/job/Clean%20Build/api/json?jsonp=_jqjsp&_1324563173011='
    expected_resp = "_jqjsp({\"displayName\": \"Clean Build\",\"name\": \"Clean Build\",\"url\": \"http://example.org/job/Clean Build/\",\"lastBuild\": {\"number\": 4,\"url\": \"http://example.org/job/Clean Build/4/\"}})"
    assert_equal expected_resp, last_response.body
  end

  def test_hudson_build_fake
    get '/job/Clean%20Build/4/api/json?jsonp=_jqjsp&_1324563173011='
    expected_resp = "_jqjsp({\"building\": false,\"description\": null,\"duration\": 59042,\"fullDisplayName\": \"Clean Build #4\",\"id\": \"2011-12-11_05-30-40\",\"keepLog\": false,\"number\": 4,\"result\": \"SUCCESS\",\"timestamp\": 1323599440186,\"url\": \"http://example.org/job/Clean Build/4/\",\"culprits\": [{\"absoluteUrl\":\"http://example.org/user/joe.bloggs\",\"fullName\": \"Joe Bloggs\"}]})"
    assert_equal expected_resp, last_response.body
  end

  def test_hudson_name_fake
    get '/user/joe.bloggs/api/json?jsonp=_bloop&_23239487='
    expected_resp = "_bloop({\"absoluteUrl\": \"http://example.org/user/joe.bloggs\",\"description\": \"Dummy user\",\"fullName\": \"Joe Bloggs\",\"id\": \"joe.bloggs\",\"property\": [{\"dummy\": \"data\"},{\"address\": \"test@me.com\"}]})"
    assert_equal expected_resp, last_response.body
  end
end
