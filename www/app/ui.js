angular.module('ui', [])
.factory('ui',
	function($q, $rootScope, $ionicModal, $ionicLoading, $ionicActionSheet, 
			$ionicPopup, $ionicSideMenuDelegate, $ionicScrollDelegate, $ionicPopover){

	var modalStack = [];
	var actionSheet = {};
	var popover = null;

	return {
		showAlert: function(title, text){
			var deferred = $q.defer();
		   	$ionicPopup.alert({
		     	title: title,
		     	template: text
		   	}).then(function(res) {
		      deferred.resolve(res);
		   	});
		   	return deferred.promise;
		},
		showToast: function(text, duration){
			duration = duration == 0 ? null : duration || 1500;
			
			$ionicLoading.show({
				template: text,
				duration: duration,
				showBackdrop: false
			});
		},
		hideToast: function(){
			$ionicLoading.hide();
		},
		showModal: function(template_url, scope){
			$ionicModal.fromTemplateUrl(template_url, {
				scope: scope,
				animation: 'animated slideInRight',
				focusFirstInput: false,
				hideDelay: 250
			}).then(function(modal) {
				modalStack.push(modal);
				modal.show();
			});
		},
		hideModal: function(){
			var popped = modalStack.pop();
			if(popped){
				popped.hide();
				popped.remove();
			}
			this.hideToast();
		},
		showPopover: function(template_url, scope, $event){
			$ionicPopover.fromTemplateUrl(template_url, {
				scope: scope
			}).then(function(obj) {
				popover = obj;
				popover.show($event);
			});
		},
		hidePopover: function(){
			if(popover) popover.hide();
		},
		showActions: function(title, scope, buttons, onDestroy){
			var self = this;
			actionSheet = $ionicActionSheet.show({
				buttons: [
					{ text: 'Edit' }
				],
				destructiveText: 'Delete',
				titleText: title,
				cancelText: 'Cancel',
				buttonClicked: function(index) {
					console.log('BUTTON CLICKED', index);
					return true;
				},
				destructiveButtonClicked: function() {
					//console.log('DESTRUCT');
					console.log(scope.service);
					self.showDeleteConfirm("Delete service "+ title, scope);
					return true;
				}
			});
		},
		closeActions: function(){
			actionSheet();
		},
	    getObjectSize: function(elementect){
		    var size = 0, key;
		    for(var key in element) {
		        if (element.hasOwnProperty(key)) size++;
		    }
		    return size;
	    },
	    closeSideMenu: function(){
	    	$ionicSideMenuDelegate.toggleLeft(false);
	    },
	    resizeWindow: function(){
	    	$ionicScrollDelegate.resize();
	    },
        showPopUp: function(title, text){
        	var deferred = $q.defer();
			var confirmPopup = $ionicPopup.confirm({
			 title: title,
			 template: text
			});
			confirmPopup.then(function(res) {
			 if(res) {
			   deferred.resolve(res);
			 } else {
			   deferred.reject();
			 }
			});
			return deferred.promise;
		},
		showPrompt: function(title, subtitle){
			var deferred = $q.defer();
			var temp = $rootScope.$new(true);
			temp.data = {};

			var inputPopup = $ionicPopup.show({
			 title: title,
			 subTitle: subtitle,
			 template: '<input type="number" ng-model="data.input">',
			 scope: temp,
			    buttons: [
			      { text: 'Cancel' },
			      {
			        text: '<b>Set</b>',
			        type: 'button-positive',
			        onTap: function(e) {
			          	if (temp.data.input)
			            	return temp.data.input;
			            else if(temp.data.input == 0)
			            	return -1;
			        	else
			          		e.preventDefault();
			        }
			      }
			    ]
			});
			inputPopup.then(function(res) {
			 if(res) {
			   deferred.resolve(res);
			 } else {
			   deferred.reject();
			 }
			});
			return deferred.promise;
		},
		scrollTop: function(){
			$ionicScrollDelegate.scrollTop();
		},
		scrollBottom: function(){
			$ionicScrollDelegate.scrollBottom();
		}
	}
});