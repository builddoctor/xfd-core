require 'rake/clean'

require 'rubygems'
require 'coffee-script'

CLEAN.include(['*.log', 'public/*.js', 'target',
               'SpecRunner.html', 'TEST-*.xml'])

desc "The default set of tasks"
task :default => [:crapcheck, :stage]

desc "Output directory"
directory "target"

desc "Compile CoffeeScript files to Javascript"
task :coffeescript => :target do
  mkdir_p "target/assets/js"
  
  beans = []
  compiled = ""
  Dir['public/assets/js/*/*.coffee'].each { |f| beans << f }
  Dir['public/assets/js/*.coffee'].each { |f| beans << f }

  beans.each { |f|
    compiled << File.read(f)
    compiled << "\n"
  }
  compiled = CoffeeScript.compile compiled

  File.open('target/assets/js/xfd.js', 'w') {|f| f.write(compiled) }
end

desc "Concatenate Javascript libraries into a single file"
task :jslibs do
  mkdir_p "target/assets/js"
  sh "cat public/assets/js/resources/jquery* > target/assets/js/xfd-libs.js"
  sh "cat public/assets/js/resources/facebox.js >> target/assets/js/xfd-libs.js"
end

desc "Minify CSS using YUI Compressor"
task :minifycss => :target do
  # initiate by copying over the other css files.
  mkdir_p "target/assets/css"
  cp_r "public/assets/css", "target/assets/"

  source = "public/assets/css/main.css"
  dest = "target/assets/css/main.css"

  sh "java -jar lib/yahoo/yuicompressor-2.4.7.jar #{source} -o #{dest}"
end

desc "Minify JS using Closure Compiler"
task :minifyjs => [:target, :coffeescript, :jslibs] do
  compiled_js = "target/assets/js/xfd.js"
  dest_js = "target/assets/js/xfd-min.js"

  sh "java -jar lib/google/closure-compiler/compiler.jar --js #{compiled_js} --js_output_file #{dest_js}"
  rm "#{compiled_js}" # don't want to deploy unminified js
end

desc "Minify"
task :minify => [:minifycss, :minifyjs]

desc "Create the deployment"
task :stage => [:minifycss, :minifyjs] do
  cp "public/assets/js/resources/ejs_0.9_alpha_1_production.js", "target/assets/js/ejs.js"
  Dir["public/*.html"].each { |f| cp f, 'target/.' }
  cp_r "public/assets/js/views", "target/assets/js"
  cp_r "public/assets/images", "target/assets"
  cp_r "public/facebox", "target"
  cp "public/favicon.ico", "target"
  cp "public/robots.txt", "target"
end

desc "Run the Sinatra server"
task :sinatra => :stage do
  require 'sinatra_server'
  XFD.run!
end

desc "Check for tabs and trailing spaces"
task :crapcheck do
  Dir["public/**/*.js"].each do |f|
    next if f.match(/^lib|resources/)
    text = File.read(f)
    raise "Tabs found in #{f}" if text.match(/\t/)
    raise "Trailing spaces found in #{f}" if text.match(/ $|	$/)
  end
end

desc "Turn crap into gold"
task :midas do
  Dir["public/**/*.js"].each do |f|
    next if f.match(/^lib|resources/)
    sh "sed -i '' 's/  /  /g' #{f}"
    sh "sed -i '' 's/ $//' #{f}"
  end
end
