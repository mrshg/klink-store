$(document).ready(function(){
  $('body').on('click', '.tabs-nav-action ul > li > a', function(e){
    e.preventDefault();
    var $this = $(this);

    if(!$this.hasClass('active')) {
      var $tabsComponent = $this.parents('.tabs-init').first(),
          //$parentLi = $this.parent('li');
          target = $this.attr('href');
      $tabsComponent.find('.tabs-nav-action').find('li').removeClass('active').filter($this.parent('li')).addClass('active');
      $tabsComponent.find('.tabs-content-action').removeClass('active').filter(target).addClass('active');
    }
  });
});
