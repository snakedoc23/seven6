Factory.define :user do |user|
  user.username 'test'
  user.email 'test@example.com'
  user.password 'test123'
  user.password_confirmation 'test123'
end

Factory.define :route do |route|
  route.title "test"
  route.description "test test test"
  route.coordinates_string "40.808291,-74.025858|40.806212,-74.0147|40.798675,-74.014357|40.789708,-74.017104"
  route.distance 2.83
  route.surface "asfalt"
  route.max_altitude 100.00
  route.min_altitude 50.00
  route.association :user
end
