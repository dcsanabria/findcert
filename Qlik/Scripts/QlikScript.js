/*
 * Bootstrap-based responsive mashup
 * @owner Enter you name here (xxx)
 */
/*
 *    Fill in host and port for Qlik engine
 */
// var prefix = window.location.pathname.substr( 0, window.location.pathname.toLowerCase().lastIndexOf( "/extensions" ) + 1 );
var prefix = '/';

var config = {
	host: "qlikdev.flipgroup.com.au",
	prefix: prefix,
	port: 443,
	// isSecure: window.location.protocol === "https:"
	isSecure: true
};
//to avoid errors in workbench: you can remove this when you have added an app
var app1;

require.config( {
	baseUrl: (config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port : "" ) + config.prefix + "resources"
} );


require( ["js/qlik"], function ( qlik ) {

	var control = false;
	qlik.setOnError( function ( error ) {
		$( '#popupText' ).append( error.message + "<br>" );
		if ( !control ) {
			control = true;
			$( '#popup' ).delay( 1000 ).fadeIn( 1000 ).delay( 11000 ).fadeOut( 1000 );
		}
	} );

	$( "#closePopup" ).click( function () {
		$( '#popup' ).hide();
	} );
	if ( $( 'ul#qbmlist li' ).length === 0 ) {
		$( '#qbmlist' ).append( "<li><a>No bookmarks available</a></li>" );
	}
	$( "body" ).css( "overflow: hidden;" );
	function AppUi ( app1 ) {
		var me = this;
		this.app1 = app1;
		app1.global.isPersonalMode( function ( reply ) {
			me.isPersonalMode = reply.qReturn;
		} );
		app1.getAppLayout( function ( layout ) {
			$( "#title" ).html( layout.qTitle );
			$( "#title" ).attr( "title", "Last reload:" + layout.qLastReloadTime.replace( /T/, ' ' ).replace( /Z/, ' ' ) );
			//TODO: bootstrap tooltip ??
		} );
		app1.getList( 'SelectionObject', function ( reply ) {
			$( "[data-qcmd='back']" ).parent().toggleClass( 'disabled', reply.qSelectionObject.qBackCount < 1 );
			$( "[data-qcmd='forward']" ).parent().toggleClass( 'disabled', reply.qSelectionObject.qForwardCount < 1 );
		} );
		app1.getList( "BookmarkList", function ( reply ) {
			var str = "";
			reply.qBookmarkList.qItems.forEach( function ( value ) {
				if ( value.qData.title ) {
					str += '<li><a data-id="' + value.qInfo.qId + '">' + value.qData.title + '</a></li>';
				}
			} );
			str += '<li><a data-cmd="create">Create</a></li>';
			$( '#qbmlist' ).html( str ).find( 'a' ).on( 'click', function () {
				var id = $( this ).data( 'id' );
				if ( id ) {
					app1.bookmark.apply( id );
				} else {
					var cmd = $( this ).data( 'cmd' );
					if ( cmd === "create" ) {
						$( '#createBmModal' ).modal();
					}
				}
			} );
		} );
		$( "[data-qcmd]" ).on( 'click', function () {
			var $element = $( this );
			switch ( $element.data( 'qcmd' ) ) {
				//app level commands
				case 'clearAll':
					app1.clearAll();
					 //$('#QV01 .lstCustomer').html('<option>Select Customer</option>');  
					break;
				case 'back':
					app1.back();
					break;
				case 'forward':
					app1.forward();
					break;
				case 'lockAll':
					app1.lockAll();
					break;
				case 'unlockAll':
					app1.unlockAll();
					break;
				case 'createBm':
					var title = $( "#bmtitle" ).val(), desc = $( "#bmdesc" ).val();
					app1.bookmark.create( title, desc );
					$( '#createBmModal' ).modal( 'hide' );
					break;
			}
		} );
}

	 $(document).ready(function () {
	 
		// $(".filters").select2();
		/*
		$(".lstReportingYear").select2({
			dropdownParent: $('#QV06')
		});
		
		$(".lstReportingMonth").select2({
			dropdownParent: $('#QV07')
		});
		$(".lstCarrier").select2({
			dropdownParent: $('#QV08')
		});
		
		$(".lstCustomer").select2({
			dropdownParent: $('#QV09')
		});
		
		
		$(".lstIsMonitored").select2({
			dropdownParent: $('#QV10')
		});
		
		$(".lstSenderState").select2({
			dropdownParent: $('#QV11')
		});
		
		$(".lstReceiverState").select2({
			dropdownParent: $('#QV12')
		});
		*/
	});

	$(document).on( "change", "#lstReportingYear", function() {  
			var str = [];
			$( "#lstReportingYear option:selected" ).each(function() {
			  str.push(parseInt($(this).text()));
			});
			app1.field("Reporting Year").selectValues(str, false, false);  
	  });  
	  
	  
	$(document).on( "change", "#lstReportingMonth", function() {  
		   	var str = [];
			
			$( "#lstReportingMonth option:selected" ).each(function() {
			 	str.push(parseInt($(this).val()));
			});
			app1.field("Reporting Month").selectValues(str, false, false);  
	  });  
	  
	$(document).on( "change", "#lstCarrier", function() {  
		    var str = "";
			$( "#lstCarrier option:selected" ).each(function() {
			  str += $( this ).text() + ",";
			});
			str = str.substring(0, str.length-1);
		   app1.field('CarrierName').selectValues([str], false, false);  
	  });  
	  
	$(document).on( "change", "#lstCustomer", function() {  
		    var str = "";
			$( "#lstCustomer option:selected" ).each(function() {
			  str += $( this ).text() + ",";
			});
			str = str.substring(0, str.length-1);
			alert(str);
		    app1.field('CustomerName').selectValues([str], false, false);
			
	  });  
	  
	$(document).on( "change", "#lstIsMonitored", function() {  
		    var str = "";
			$( "#lstIsMonitored option:selected" ).each(function() {
			  str += $( this ).text() + ",";
			});
			str = str.substring(0, str.length-1);
		   	app1.field('IsMonitored').selectValues([str], false, false);  
	  });  
	  
	$(document).on( "change", "#lstSenderState", function() {  
		    var str = "";
			$( "#lstSenderState option:selected" ).each(function() {
			  str += $( this ).text() + ",";
			});
			str = str.substring(0, str.length-1);
		   app1.field('Sender State').selectValues([str], false, false);  
	  });  
	  
	$(document).on( "change", "#lstReceiverState", function() {  
		    var str = "";
			$( "#lstReceiverState option:selected" ).each(function() {
			  str += $( this ).text() + ",";
			});
			str = str.substring(0, str.length-1);
		   app1.field('Receiver State').selectValues([str], false, false);  
	  });  
	  
	  
	  
	//callbacks -- inserted here --
	function showReportingYear(reply, app){}
	function showReportingMonth(reply, app){}
	function showCustomer(reply, app){}
	function showCarrier(reply, app){}
	function showIsMonitored(reply, app){}
	function showSenderState(reply, app){}
	function showReceiverState(reply, app){}
	function showIsMonitored(reply, app){}
	
	function createAllLists()
	{
		app1.createList({
		"qFrequencyMode": "V",
		"qDef": {
				"qFieldDefs": [
						"Reporting Year"
				]
		},
		"qExpressions": [],
		"qInitialDataFetch": [
				{
						"qHeight": 20,
						"qWidth": 1
				}
		],
		"qLibraryId": "4bf6cfc0-62df-4ad7-b5ae-9ea351437fd1"
		},showReportingYear);
	
	  app1.createList({
		  "qFrequencyMode": "V",
		  "qDef": {
				  "qFieldDefs": [
						  "Reporting Month"
				  ]
		  },
		  "qExpressions": [],
		  "qInitialDataFetch": [
				  {
						  "qHeight": 20,
						  "qWidth": 1
				  }
		  ],
		  "qLibraryId": "pvKKMs"
	  },showReportingMonth);

	  app1.createList({
		"qFrequencyMode": "V",
		"qDef": {
				"qFieldDefs": [
						"CarrierName"
				]
		},
		"qExpressions": [],
		"qInitialDataFetch": [
				{
						"qHeight": 20,
						"qWidth": 1
				}
		],
		"qLibraryId": "MPPTUCU"
	},showCarrier);
	
	
	app1.createList({
		"qFrequencyMode": "V",
		"qDef": {
				"qFieldDefs": [
						"CustomerName"
				]
		},
		"qExpressions": [],
		"qInitialDataFetch": [
				{
						"qHeight": 20,
						"qWidth": 1
				}
		],
		"qLibraryId": "pEJbAKc"
	},showCustomer);

	  app1.createList({
		  "qFrequencyMode": "V",
		  "qDef": {
				  "qFieldDefs": [
						  "Monitored?"
				  ]
		  },
		  "qExpressions": [],
		  "qInitialDataFetch": [
				  {
						  "qHeight": 20,
						  "qWidth": 1
				  }
		  ],
		  "qLibraryId": "mtdcgE"
	  },showIsMonitored);


	  app1.createList({
		  "qFrequencyMode": "V",
		  "qDef": {
				  "qFieldDefs": [
						  "Receiver State"
				  ]
		  },
		  "qExpressions": [],
		  "qInitialDataFetch": [
				  {
						  "qHeight": 20,
						  "qWidth": 1
				  }
		  ],
		  "qLibraryId": "eFunrUM"
	  },showReceiverState);


	  app1.createList({
		  "qFrequencyMode": "V",
		  "qDef": {
				  "qFieldDefs": [
						  "Sender State"
				  ]
		  },
		  "qExpressions": [],
		  "qInitialDataFetch": [
				  {
						  "qHeight": 20,
						  "qWidth": 1
				  }
		  ],
		  "qLibraryId": "e1a18c28-25fa-4a57-8762-4960ef5eaac1"
	  },showSenderState);
} // end of createAllLists
	
	//open apps -- inserted here --
	var app1 = qlik.openApp('0bb1780e-4947-4bb5-b7f9-f3097ae2f446', config);
    //get objects -- inserted here --

	app1.getObject('QV08', 'snnh');
	app1.getObject('QV09', 'kReSM');
	app1.getObject('QV10', 'eSYRqy');
	app1.getObject('QV11', 'jpHCKw');
	app1.getObject('QV12', 'pahm');

    app1.getObject('QV13','agQmec');
	app1.getObject('QV14','Yzpxc');
	
	//create cubes and lists -- inserted here --
	createAllLists();
	
	 // get Year Field Data 
	 var yearField = app1.field("Reporting Year").getData({
	 	rows: 50
	 });
	 
	 yearField.OnData.bind( function(){
		 $('#yearBadge').text( yearField.stateCounts.qSelected + ' of ' + ( parseInt(yearField.stateCounts.qExcluded) + parseInt(yearField.stateCounts.qSelected ) + parseInt(yearField.stateCounts.qAlternative )  + parseInt(yearField.stateCounts.qOption)) ) ;
		 $('#lstReportingYear').empty();  
		 yearField.rows.forEach(function(row){
		  // console.log(row.qText + '-' + row.qState);
		  var yearRowStatus = row.qState;
		  var yearName = row.qText;
		  switch(yearRowStatus)
		  {
		  
			case 'S':
			  // options SELECTED
			  $('#lstReportingYear').append('<option>'+ yearName +'</option>');  
			  break;
			case 'O':
			  // options AVAILABLE
			  $('#lstReportingYear').append('<option>'+ yearName +'</option>');  
			  break;
			case 'X':
			  // options EXCLUDED
			  //$('.lstReportingYear').append('<option background-color:grey>'+ yearName +'</option>');  
			  break;
			default:
				$('#lstReportingYear').append('<option>'+ yearName +'</option>');  
				break;
		  }
		  
		 	//$('#lstReportingYear').selectpicker('refresh');
			// $('#lstReportingYear').selectpicker('render');
		
		});
	  });
	  
	   // get Month Field Data 
	 var monthField = app1.field("Reporting Month").getData({
	 	rows: 12
	 });
	 monthField.OnData.bind( function(){
		 $('#monthBadge').text( monthField.stateCounts.qSelected + ' of ' + ( parseInt(monthField.stateCounts.qExcluded) + parseInt(monthField.stateCounts.qSelected ) + parseInt(monthField.stateCounts.qAlternative )  + parseInt(monthField.stateCounts.qOption)) ) ;
		 $('#lstReportingMonth').empty();  
		 monthField.rows.forEach(function(row){
		  // console.log(row.qText + '-' + row.qState);
		  var monthRowStatus = row.qState;
		  var monthName = row.qText;
		  var monthQNumber = row.qNum;
		  switch(monthRowStatus)
		  {
			case 'S':
			  // options SELECTED
			  $('#lstReportingMonth').append('<option value=' + monthQNumber + '>'+ monthName +'</option>');  
			  break;
			case 'O':
			  // options AVAILABLE
			  $('#lstReportingMonth').append('<option value=' + monthQNumber + '>'+ monthName +'</option>');  
			  break;
			case 'X':
			  // options EXCLUDED
			  //$('#lstReportingMonth').append('<option value=' + monthQNumber + '>'+ monthName +'</option>');  
			  break;
			default:
				$('#lstReportingMonth').append('<option value=' + monthQNumber + '>'+ monthName +'</option>');  
				break;
					
		  }
		});
		
			//$('#lstReportingMonth').selectpicker('refresh');
			// $('#lstReportingMonth').selectpicker('render');
	  });
	
	
	  
	 // get Customer Field Data 
	 var customerField = app1.field("CustomerName").getData({
	 	rows: 7000
	 });
	 customerField.OnData.bind( function(){
		 $('#customerBadge').text( customerField.stateCounts.qSelected + ' of ' + ( parseInt(customerField.stateCounts.qExcluded) + parseInt(customerField.stateCounts.qSelected ) + parseInt(customerField.stateCounts.qAlternative )  + parseInt(customerField.stateCounts.qOption)) ) ;
		 $('#stCustomer').empty();  
		 customerField.rows.forEach(function(row){
		  // console.log(row.qText + '-' + row.qState);
		  var customerRowStatus = row.qState;
		  var customerName = row.qText;
		  switch(customerRowStatus)
		  {
			case 'S':
				// options SELECTED
				$('#lstCustomer').append('<option>'+ customerName +'</option>');  
				break;
			case 'O':
				// options AVAILABLE
				$('#lstCustomer').append('<option>'+ customerName +'</option>');  
				break;
			case 'X':
				// options EXCLUDED
				//$('#stCustomer').append('<option>'+ customerName +'</option>');  
				break;
			default:
				$('#lstCustomer').append('<option>'+ customerName +'</option>');  
				break;
		  }
		  	
		});
			//$('#lstCustomer').selectpicker('refresh');
			// $('#lstCustomer').selectpicker('render');
	  });
	  

	  
	// get Carrier Field Data 
	 var carrierField = app1.field("CarrierName").getData({
	 	rows: 1000
	 });
	 carrierField.OnData.bind( function(){
		 $('#carrierBadge').text( carrierField.stateCounts.qSelected + ' of ' + ( parseInt(carrierField.stateCounts.qExcluded) + parseInt(carrierField.stateCounts.qSelected ) + parseInt(carrierField.stateCounts.qAlternative )  + parseInt(carrierField.stateCounts.qOption))  + '(' + carrierField.stateCounts.qOption + ')' ) ;
		 $('#lstCarrier').empty();  
		 
		carrierField.rows.forEach(function(row){
		  console.log(row.qText + '-' + row.qState);
		  var carrierRowStatus = row.qState;
		  var carrierName = row.qText;
		  switch(carrierRowStatus)
		  {
			case 'S':
			  // options SELECTED
			  $('#lstCarrier').append('<option>'+ carrierName +'</option>');  
			  break;
			case 'O':
			  // options AVAILABLE
			  $('#lstCarrier').append('<option>'+ carrierName +'</option>');  
			  break;
			case 'X':
			  // options EXCLUDED
			  //$('#lstCarrier').append('<option>'+ carrierName +'</option>');  
			  break;
			default:
				$('#lstCarrier').append('<option>'+ carrierName +'</option>');  
				break;
		  }
		
		});
			//$('#lstCarrier').selectpicker('refresh');
			// $('#lstCarrier').selectpicker('render');
	  });
	  
	  
	 // get isMonitored Field Data 
	 var isMonitoredField = app1.field("Monitored?").getData({
	 	rows: 4
	 });
	 isMonitoredField.OnData.bind( function(){
		 $('#isMonitoredBadge').text( isMonitoredField.stateCounts.qSelected + ' of ' + ( parseInt(isMonitoredField.stateCounts.qExcluded) + parseInt(isMonitoredField.stateCounts.qSelected ) + parseInt(isMonitoredField.stateCounts.qAlternative )  + parseInt(isMonitoredField.stateCounts.qOption)) ) ;
		 $('#lstIsMonitored').empty();  
		 isMonitoredField.rows.forEach(function(row){
		  // console.log(row.qText + '-' + row.qState);
		  var isMoninotedRowStatus = row.qState;
		  var isMonitoredName = row.qText;
		  switch(isMoninotedRowStatus)
		  {
			case 'S':
				// options SELECTED
				$('#lstIsMonitored').append('<option>'+ isMonitoredName +'</option>');  
				break;
			case 'O':
				// options AVAILABLE
				$('#lstIsMonitored').append('<option>'+ isMonitoredName +'</option>');  
				break;
			case 'X':
				// options EXCLUDED
				//$('#lstIsMonitored').append('<option>'+ isMonitoredName +'</option>');  
				break;
			default:
				$('#lstIsMonitored').append('<option>'+ isMonitoredName +'</option>');  
				break;
		  }
		});
		
			//$('#lstIsMonitored').selectpicker('refresh');
			// $('#lstIsMonitored').selectpicker('render');
	  });
	  
	  // get senderState Field Data 
	 var senderStateField = app1.field("Sender State").getData({
	 	rows: 50
	 });
	 senderStateField.OnData.bind( function(){
		 $('#senderStateBadge').text( senderStateField.stateCounts.qSelected + ' of ' + ( parseInt(senderStateField.stateCounts.qExcluded) + parseInt(senderStateField.stateCounts.qSelected ) + parseInt(senderStateField.stateCounts.qAlternative )  + parseInt(senderStateField.stateCounts.qOption)) ) ;
		 $('#lstSenderState').empty();  
		 senderStateField.rows.forEach(function(row){
		  // console.log(row.qText + '-' + row.qState);
		  var senderStateRowStatus = row.qState;
		  var senderStateName = row.qText;
		  switch(senderStateRowStatus)
		  {
			case 'S':
				// options SELECTED
				$('#lstSenderState').append('<option>'+ senderStateName +'</option>');  
				break;
			case 'O':
				// options AVAILABLE
				$('#lstSenderState').append('<option>'+ senderStateName +'</option>');  
				break;
			case 'X':
				// options EXCLUDED
				//$('#lstSenderState').append('<option>'+ senderStateName +'</option>');  
				break;
			default:
				$('#lstSenderState').append('<option>'+ senderStateName +'</option>');  
				break;
		  }
		});
			//$('#lstSenderState').selectpicker('refresh');
			// $('#lstSenderState').selectpicker('render');
	  });
	  
	  
	   // get receiverState Field Data 
	 var receiverStateField = app1.field("Receiver State").getData({
	 	rows: 50
	 });
	 receiverStateField.OnData.bind( function(){
		 $('#receiverStateBadge').text( receiverStateField.stateCounts.qSelected + ' of ' + ( parseInt(receiverStateField.stateCounts.qExcluded) + parseInt(receiverStateField.stateCounts.qSelected ) + parseInt(receiverStateField.stateCounts.qAlternative )  + parseInt(receiverStateField.stateCounts.qOption)) ) ;
		 $('#lstReceiverState').empty();  
		 receiverStateField.rows.forEach(function(row){
		  // console.log(row.qText + '-' + row.qState);
		  var receiverStateRowStatus = row.qState;
		  var receieverStateName = row.qText;
		  switch(receiverStateRowStatus)
		  {
			case 'S':
				// options SELECTED
				$('#lstReceiverState').append('<option>'+ receieverStateName +'</option>');  
				break;
			case 'O':
				// options AVAILABLE
				$('#lstReceiverState').append('<option>'+ receieverStateName +'</option>');  
				break;
			case 'X':
				// options EXCLUDED
				//$('#lstReceiverState').append('<option>'+ receieverStateName +'</option>');  
				break;
			default:
				$('#lstReceiverState').append('<option>'+ receieverStateName +'</option>');  
				break;
		  }
		});
			//$('#lstReceiverState').selectpicker('refresh');
			// $('#lstReceiverState').selectpicker('render');
	  });


if ( app1 ) {
		new AppUi( app1 );
	}

} );