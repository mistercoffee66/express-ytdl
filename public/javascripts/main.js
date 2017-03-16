(function ($) {

  var ConvertForm = function (selector) {
    this.$form = $(selector);
    this.button = this.$form.find('button');
    this.data = {};
    this.fileUrl = '';
    this.init();
  };

  ConvertForm.prototype.handleSubmit = function () {
    //console.log(data);
    //TODO: show loader
    this.convert();
  };

  ConvertForm.prototype.convert = function () {
    //TODO: hide loader
    window.location = '/convert?yturl=' + this.data.yturl;
  };

  ConvertForm.prototype.init = function () {
    var self = this;

    $(this.button).on('click', function (e) {
      e.preventDefault();
      self.data = massageArray(self.$form.serializeArray());

      self.handleSubmit();
    });

    function massageArray(array) {

      var o = {};

      array.forEach(function (item, i, arr) {
        o[item.name] = item.value;
      });

      return o;
    }
  };


  new ConvertForm('#convert-form');

}(jQuery));