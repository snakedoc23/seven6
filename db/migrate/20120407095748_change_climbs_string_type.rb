class ChangeClimbsStringType < ActiveRecord::Migration
  def self.up
    change_table :routes do |t|
      t.change :climbs_string, :text
    end
  end

  def self.down
    change_table :routes do |t|
      t.change :climbs_string, :string
    end  
  end
end
