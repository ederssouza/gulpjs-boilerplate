
var regexFullName  = /^([A-zÀ-ú]{2,})(\s[A-zÀ-ú]{2,})((\s[A-zÀ-ú]{2,})+)?$/;

var regexCNPJ 		 = /^(\d{2})\.(\d{3})\.(\d{3})\.(\d{4})\-(\d{2})$/;

var regexCPF       = /^(\d{3})\.(\d{3})\.(\d{3})\-(\d{2})$/;

var regexRG        = /^(\d{2})\.(\d{3})\.(\d{3})-(\d)$/;

var regexCEP 	     = /^(\d{5})-(\d{3})$/;

var regexTime      = /^(([0|1][0-9])|([2][0-3])):([0-5][0-9])$/;

var regexUrl       = /^(http:\/\/|https:\/\/|\/\/)(www\.)?([a-zA-Z0-9\._-]+\.)[a-zA-Z-0-9]{2,3}$/;

var regexYouTube   = /^(?:http:\/\/|https:\/\/|\/\/)(?:www\.)?youtube\.com\/watch\?v=([\w\-]+)/;

var regexEmail 		 = /^[a-zA-Z0-9][a-zA-Z0-9\._-]+@([a-zA-Z0-9\._-]+\.)[a-zA-Z-0-9]{2,3}$/;

// d/m/yyyy | dd/mm/yyyy | d-m-yyyy | dd-mm-yyyy | d.m.yyyy | dd.mm.yyyy | 1917 to 2999
var regexDate  	   = /^(0?[1-9]|[1|2][0-9]|3[0,1])[\.\-\/](0?[1-9]|1[0-2])[\.\-\/](1[917-999]{3}|2[000-999]{3})$/;

// (99) 99999-9999 | (99) 9999-9999
var regexPhone 		 = /^\((1[1-9]|2[12478]|3[1234578]|4[1-9]|5[1345]|6[1-9]|7[134579]|8[1-9]|9[1-9])\)\s(9)?(\d{4})-(\d{4})$/;

// user agent
var regexUserAgent = /^Mozilla\/[\d\.]+\s\((?:X11;\s)?([\w;\s\.\:\-\/]+)\)\s(?:AppleWebKit\/[\d\.]+\s\(KHTML,\slike\sGecko\)|Gecko\/\d+?)\s(?:Version\/[\d\.]+\s)?(?:Mobile\/[\w\d]+\s)?([\w\d\/\.]+)/;