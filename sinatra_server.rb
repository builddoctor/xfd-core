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
# -*- coding: utf-8 -*-
require 'rubygems'
require 'sinatra/base'

class XFD < Sinatra::Base
  set :static, true
  set :root, File.dirname(__FILE__)
  set :public_folder, File.dirname(__FILE__) + '/target'

  configure :development, :test do
    set :port, 8081
  end

  configure :production do
    set :port, 80
  end

  get '/' do
    File.read('public/index.html')
  end

  get '/version/?' do
    content_type :json
    version = String(File.read('VERSION')).strip
    data = "{\"version\": \"#{version}\"}"
    data
  end

  # Example data for all projects.
  get '/hudson/api/json*' do
    content_type :json
    reference = params[:jsonp]
    url = url('/')
    data = reference + "({\"assignedLabels\":[{}],\"mode\":\"NORMAL\",\"nodeDescription\":\"the master Hudson node\",\"nodeName\":\"\",\"numExecutors\":2,\"description\":null,\"jobs\":[{\"name\":\"Broken Build\",\"url\":\"#{url}job/Broken%20Build/\",\"color\":\"red\"},{\"name\":\"Clean Build\",\"url\":\"#{url}job/Clean%20Build/\",\"color\":\"blue\"}],\"overallLoad\":{},\"primaryView\":{\"name\":\"All\",\"url\":\"#{url}\"},\"slaveAgentPort\":0,\"useCrumbs\":false,\"useSecurity\":false,\"views\":[{\"name\":\"All\",\"url\":\"#{url}\"}]})"
    data
  end

  # Example data for a specific job/project.
  get '/job/:job/api/json*' do |job, the_rest|
    content_type :json
    reference = params[:jsonp]
    url = url('/')
    data = reference + "({\"displayName\": \"#{job}\",\"name\": \"#{job}\",\"url\": \"#{url}job/#{job}/\",\"lastBuild\": {\"number\": 4,\"url\": \"#{url}job/#{job}/4/\"}})"
    data
  end

  # Example data for a specific job's build.
  get '/job/:job/:number/api/json*' do |job, number, the_rest|
    content_type :json
    reference = params[:jsonp]
    url = url('/')
    data = reference + "({\"building\": false,\"description\": null,\"duration\": 59042,\"fullDisplayName\": \"#{job} ##{number}\",\"id\": \"2011-12-11_05-30-40\",\"keepLog\": false,\"number\": #{number},\"result\": \"SUCCESS\",\"timestamp\": 1323599440186,\"url\": \"#{url}job/#{job}/#{number}/\",\"culprits\": [{\"absoluteUrl\":\"#{url}user/joe.bloggs\",\"fullName\": \"Joe Bloggs\"}]})"
    data
  end

  get '/user/:name/api/json*' do |name, the_rest|
    content_type :json
    reference = params[:jsonp]
    url = url('/')
    clean_name = name.gsub(".", " ").split(" ").each { |word| word.capitalize!}.join(" ")
    data = reference + "({\"absoluteUrl\": \"#{url}user/#{name}\",\"description\": \"Dummy user\",\"fullName\": \"#{clean_name}\",\"id\": \"#{name}\",\"property\": [{\"dummy\": \"data\"},{\"address\": \"test@me.com\"}]})"
    data
  end

  run! if app_file == $0
end
