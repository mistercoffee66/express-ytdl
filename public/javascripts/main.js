(function ($) {

  //const reggie = new RegExp(/https?:\/\/(www\.)?youtube\.com\/watch\?v=[A-Za-z0-9_-]+/gi);

  const $body = $('body');

  class ConvertForm {
    constructor(selector) {
      this.$form = $(selector);
      this.$loader = $('#loader');
      this.$button = $(this.$form.find('button')[0]);
      this.$field = $(this.$form.find('input[type="text"]')[0]);
      this.data = {};
      this.fileUrl = '';
      this.isValid = false;
      this.hasbeenSubmitted = false;
      this.reggie = /https?:\/\/(?:www\.)?(youtube\.com|youtu\.be)\/(watch\?v=)?[A-Za-z0-9_-]+/i;
      this.init();
    }

    handleEvents() {

      this.$button.on('click', (e) => {
        e.preventDefault();
        this.hasbeenSubmitted = true;
        if (this.isValid) {
          this.data = massageArray(this.$form.serializeArray());
          this.handleSubmit();
        }
      });

      this.$field.on('keyup', (e) => {
        this.validate();
      });

      this.$field.on('paste', (e) => {
        this.validate();
      });

      this.$field.on('blur', (e) => {
        this.hasbeenSubmitted = true;
        this.validate();
      });
    }

    validate() {
      this.isValid = this.reggie.test(this.$field.val());
      if (this.isValid) {
        this.$button.removeClass('disabled');
        this.$field.removeClass('error').addClass('valid');
      }
      else {
        this.$button.addClass('disabled');
        this.$field.removeClass('valid');
        if (this.hasbeenSubmitted) {
          this.$field.addClass('error');
        }
      }

    }

    handleSubmit() {
      this.$loader.fadeIn();
      this.$form.fadeOut();
      if (this.data.yturl) {
        this.convert();
      }
    }

    convert() {
      let self = this;
      //window.location = '/convert?yturl=' + this.data.yturl;
      $.get('/convert?yturl=' + this.data.yturl, function(data, status, jqXHR){
        window.location = '/convert?yturl=' + self.data.yturl;
        self.$loader.fadeOut();
        self.$form.fadeIn();
      })
    }

    init() {
      this.handleEvents();
    }

  }

  function massageArray(array) {

    let o = {};

    array.forEach(function (item, i, arr) {
      o[item.name] = item.value;
    });

    return o;
  }

  new ConvertForm('#convert-form');

}(window.jQuery));
