var banner = {
  img_height: '800px',
  img_urls: [],
  num: 0,
  width: 0,
  count: 0,
  timer:null,
  init: function () {
    this.width = $('.banner').width()
    this.count = this.img_urls.length
    var count = this.count,
      i;
    for (i = 0; i < count + 1; i++) {
      $('.banner ul').append('<li></li>')
      if (i === 0) {
        $('.banner ol').append('<li class="current"></li>')
      } else if (i < count) {
        $('.banner ol').append('<li></li>')
      }
    }
    $('.banner ul li').css('background-image', 'url(' + this.img_urls[0] + ')').css('width', `${100/(count+1)}%`);
    $.each(this.img_urls, function (key, value) {
      $('.banner ul li').eq(key).css('background-image', 'url(' + value + ')');
    });

    $('.banner').css('height', this.img_height);

    $('.banner ul').css('width', (count + 1) * 100 + '%');

    $('.banner ol').css('width', count * 20 + 'px').css('margin-left', -count * 20 * 0.5 - 10 + 'px');
    var self = this;
    $('.banner ol li').mouseover(function () { //用hover的话会有两个事件(鼠标进入和离开)
      console.log(this)
      $(this).addClass('current').siblings().removeClass('current');
      //获取当前编号
      var i = $(this).index();
      //console.log(i);
      self.moveTo(i)
    });
    // this.play()
  },
  resize() {

  },
  moveTo(i){
    $('.banner ul').stop().animate({
      left: -i * this.width
    }, 500);
    this.num = i;
  },
  prev() {
    console.log(this.width)
    this.num--
      if (this.num < 0) {
        //悄悄把图片跳到最后一张图(复制页,与第一张图相同),然后做出图片播放动画，left参数是定位而不是移动的长度
        $('.banner ul').css({
          left: -this.width * this.count
        }).stop().animate({
          left: -this.width * (this.count - 1)
        }, 500);
        this.num = this.count - 1;
      } else {
        //console.log(num);
        $('.banner ul').stop().animate({
          left: -this.num * this.width
        }, 500);
      }
    if (this.num === this.count - 1) {
      $('.banner ol li').eq(this.count - 1).addClass('current').siblings().removeClass('current');
    } else {
      $('.banner ol li').eq(this.num).addClass('current').siblings().removeClass('current');

    }
  },
  next() {
    this.num++;
    if (this.num > this.count) {
      //播放到最后一张(复制页)后,悄悄地把图片跳到第一张,因为和第一张相同,所以难以发觉,
      $('.banner ul').css({
        left: 0
      }).stop().animate({
        left: -this.width
      }, 500);
      //css({left:0})是直接悄悄改变位置，animate({left:-this.width},500)是做出移动动画
      //随后要把指针指向第二张图片,表示已经播放至第二张了。
      this.num = 1;
    } else {
      //在最后面加入一张和第一张相同的图片，如果播放到最后一张，继续往下播，悄悄回到第一张(肉眼看不见)，从第一张播放到第二张
      //console.log(num);
      $('.banner ul').stop().animate({
        left: -this.num * this.width
      }, 500);
    }
    if (this.num == this.count) {
      $('.banner ol li').eq(0).addClass('current').siblings().removeClass('current');
    } else {
      $('.banner ol li').eq(this.num).addClass('current').siblings().removeClass('current');

    }
  },
  play(){
    this.timer = setInterval(this.next.bind(this),2000);
  }
}

module.exports = banner