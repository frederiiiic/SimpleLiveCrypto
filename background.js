if(!localStorage.getItem('NewDivId')) {
	var NewDivId = 0;
}
else {
	var NewDivId = Number(localStorage.getItem('NewDivId'));
}

document.addEventListener('DOMContentLoaded', function() {
	for(i = 0; i < NewDivId; i++) {
		if(localStorage.getItem('cur'+i)) {
			var parag = document.createElement('div');
			parag.setAttribute('id','cur'+i);
			parag.setAttribute('class','cur');
			document.getElementById('currency').appendChild(parag).innerHTML = localStorage.getItem('cur'+i);
			document.getElementById('del'+i).addEventListener("click", function(){del_cur(this.id)});	
		}
	}
	ReloadCur();
	document.getElementById("add").addEventListener("click", add_cur);
	document.getElementById("clear").addEventListener("click", clearCur);
});

var xmlhttp = new XMLHttpRequest();
var url = "https://api.coinmarketcap.com/v1/ticker/?convert=EUR";

xmlhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		var myArr = JSON.parse(this.responseText);
		CurGet(myArr);
	}
};

xmlhttp.open("GET", url, true);
xmlhttp.send();

function CurGet(arr) {
	var out = "<option id='choose'>Choose Coins</option>";
	var i;
	for(i = 0; i < arr.length; i++) {
		out += '<option name="c'+i+'">'+arr[i].id;
	}
	document.getElementById("crypto").innerHTML = out;
}

function CurGetInfo(CurId,NbDiv) {
	var xmlhttp = new XMLHttpRequest();
	var url = "https://api.coinmarketcap.com/v1/ticker/"+CurId+"/?convert=EUR";
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var arr = JSON.parse(this.responseText);
			var sym = "";
			var pricebtc = "";
			var priceeur = "";
			var change24h = "";
			var change7d = "";
			var i;
			sym = arr[0].symbol;
			pricebtc = mBTC(arr[0].price_btc);
			pricebtc = round1000(pricebtc);
			priceeur = arr[0].price_eur;
			change24h = arr[0].percent_change_24h;
			if(change24h < 0) {
				style24h = "color:red;";
			}
			else {
				style24h = "color:green;";
			}
			change7d = arr[0].percent_change_7d;
			if(change7d < 0) {
				style7d = "color:red;";
			}
			else {
				style7d = "color:green;";
			}
			document.getElementById('sym'+NbDiv).innerHTML = sym;
			document.getElementById('pricebtc'+NbDiv).innerHTML = pricebtc;
			document.getElementById('priceeur'+NbDiv).innerHTML = round100(priceeur);
			document.getElementById('change24h'+NbDiv).innerHTML = change24h;
			document.getElementById('change24h'+NbDiv).setAttribute('style',style24h);
			document.getElementById('change7d'+NbDiv).innerHTML = change7d;
			document.getElementById('change7d'+NbDiv).setAttribute('style',style7d);
		}
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

function ReloadCur() {
	var CountDiv = document.getElementById('currency').getElementsByTagName('div').length;
	var NbDiv = null;
	for(i = 0; i < CountDiv; i++) {
		NbDiv = Number(document.getElementById('currency').getElementsByTagName('div')[i].id.replace(/[^\d]/g, ""))
		CurId = document.getElementById('currency').getElementsByTagName('div')[i].getElementsByTagName('span')[0].innerHTML;
		CurGetInfo(CurId,NbDiv);
	}
}

function add_cur() {
	i = NewDivId;
	var i2 = i + 1;
	var sel = document.forms.selcrypto.crypto.options.selectedIndex;
	if(sel != 0) {
		var cur = document.forms.selcrypto.crypto.options[sel].value; 
		var spancur = 'namecur'+i;
		var spansym = 'sym'+i;
		var spanpricebtc = 'pricebtc'+i;
		var spanpriceeur = 'priceeur'+i;
		var spanchange24h = 'change24h'+i;
		var spanchange7d = 'change7d'+i;
		var parag = document.createElement('div');
		parag.setAttribute('id','cur'+i);
		parag.setAttribute('class','cur');
		var SaveValue = document.getElementById('currency').appendChild(parag).innerHTML = '<span id="'+spancur+'" class="namecur">'+cur+'</span><a href="https://coinmarketcap.com/currencies/'+cur+'/"><span class="cont-sym"><img src="https://files.coinmarketcap.com/static/img/coins/16x16/'+cur+'.png"><span id="'+spansym+'"></span></span></a><span class="cont-btc"><span id="'+spanpricebtc+'"></span></span><span class="cont-eur"><span id="'+spanpriceeur+'"></span></span><span class="cont-24h"><span id="'+spanchange24h+'"></span></span><span class="cont-7d"><span id="'+spanchange7d+'"></span></span><span class="cont-del"><a id="del'+i+'" title="Click here to delete the currency from your list">x</a></span>';
		CurGetInfo(cur,i);
		NewDivId=i2;
		document.getElementById('del'+i).addEventListener("click", function(){del_cur(this.id)});
		localStorage.setItem('NewDivId', NewDivId);
		localStorage.setItem('cur'+i, SaveValue);
	}
}

function del_cur(i) {
	i = Number(i.replace(/[^\d]/g, ""));
	del = document.getElementById('cur'+i);
	del.parentNode.removeChild(del);
	localStorage.removeItem('cur'+i);
}

function clearCur() {
	for(i = 0; i < NewDivId; i++) {
		if(localStorage.getItem('cur'+i)) {
			cur = 'cur'+i;
			del_cur(cur);
		}
	}
	localStorage.clear();
}

function round100(x) {
	return (Math.round(x * 100) / 100);
}

function round1000(x) {
	return (Math.round(x * 1000) / 1000);
}

function mBTC(x) {
	return (x * 1000);
}