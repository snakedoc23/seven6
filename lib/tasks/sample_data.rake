

namespace :db do
  desc "Fill database with sample data"
  task :populate => :environment do
    require 'faker'
    Rake::Task['db:reset'].invoke
    User.create!(:username => "test",
                 :name => "Alfred",
                 :email => "test@test.pl",
                 :age => 24,
                 :place => "Tychy",
                 :password => "test",
                 :password_confirmation => "test")
    99.times do |n|
      username = Faker::Internet.user_name
      name = Faker::Name.name
      place = Faker::Address.city
      age = rand(38) + 9
      email = Faker::Internet.email
      password = "test"
      User.create!(:username => username,
                   :name => name,
                   :place => place,
                   :age => age,
                   :email => email,
                   :password => password,
                   :password_confirmation => password)
    end
  end
end