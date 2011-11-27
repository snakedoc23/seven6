require 'spec_helper'

describe Comment do
  before(:each) do
    @user = Factory(:user)
    @route = Factory(:route, :user => @user)
    @content = 'test123'
  end
  it 'tworzy nowy' do
    @comment = @user.comments.build(
      :content => @content,
      :route => @route
    )
    @comment.save
    @comment.user.should == @user
    @comment.content.should == 'test123'
  end

  it 'tresc nie moze byc pusta' do
    @comment = @user.comments.build(
      :content => '',
      :route => @route
    )
    @comment.user.should == @user
    @comment.should_not be_valid
  end

  it 'tresc nie moze przekraczac 150 znakow' do
    @comment = @user.comments.build(
      :content => 'x' * 151,
      :route => @route
    )
    @comment.user.should == @user
    @comment.should_not be_valid
  end

  it 'route_comments zwraca tablice komentarzy' do
    @comment = Factory(:comment, :user => @user, :route => @route)
    @comment.user.should == @user
    Comment.route_comments(@route).size.should == 1
    @comment2 = Factory(:comment, :user => @user, :route => @route)
    Comment.route_comments(@route).last.should == @comment2
  end

  it 'edycja' do
    @comment = Factory(:comment, :user => @user, :route => @route)
    @comment.save
    @comment.should be_valid
    @comment.content = 'zmiana'
    @comment.save
    @comment.content.should == 'zmiana'
  end

  it 'usuwanie' do
    @comment = Factory(:comment, :user => @user, :route => @route)
    @comment.save
    Comment.all.size.should == 1
    lambda do
      @comment.destroy
    end.should change(Comment, :count).by(-1)
    Comment.all.size.should == 0
  end
end