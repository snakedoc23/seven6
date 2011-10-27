class CreateWorkouts < ActiveRecord::Migration
  def self.up
    create_table :workouts do |t|
      t.string :route_id
      t.string :user_id
      t.text :description
      t.float :total_time
      t.float :avg_speed
      t.float :max_speed
      t.float :pulse_max
      t.float :pulse_avg
      t.float :temperature

      t.timestamps
    end
    add_index :workouts, :route_id
    add_index :workouts, :user_id
  end

  def self.down
    drop_table :workouts
  end
end
