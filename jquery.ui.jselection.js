/*!
 * jQuery UI jSelection 
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */

(function($) {

	// Let's call the widget factory!
	$.widget("ui.jselection", {

		//           _   _             
		//  ___ _ __| |_(_)___ _ _  ___
		// / _ \ '_ \  _| / _ \ ' \(_-<
		// \___/ .__/\__|_\___/_||_/__/
		//     |_|    
		/**
		@property options
		@type Object
		*/
		options: {
			tag: "q",
			activeClass: "active",
			selectedClass: "selected"
		},

		//                  _       
		//  __ _ _ ___ __ _| |_ ___ 
		// / _| '_/ -_) _` |  _/ -_)
		// \__|_| \___\__,_|\__\___|
		//                      
		_create: function() {

			var ctxt = this,
				o = ctxt.options,
				el = ctxt.element;

			ctxt._super();

			// provide a context for CSS rules.
			el.addClass("ui-jselection");

			var html = el.html();

			// prepare elements for selection
			ctxt.util._wrapTokens(el, o.tag);

			// Set the 'words' as a data element to cache them.
			var words = el.find(o.tag);

			// Cache the words.
			ctxt.words = words;
			ctxt.html = html;

			el.disableSelection();


			// Clear selection on clicking the body.
			var clearSelection = function() {
				words.removeClass("selected").removeClass('first');
			};

			$("body").off('click', clearSelection);
			$("body").on('click', clearSelection);


			// Bind the mousedown handler to begin selection based on hover.
			el.bind("mousedown", ctxt.handlers._mousedown).bind("mouseup", ctxt.handlers._mouseup);

			return el;

		},


		//            _   _            _    
		//  _ __  ___| |_| |_  ___  __| |___
		// | '  \/ -_)  _| ' \/ _ \/ _` (_-<
		// |_|_|_\___|\__|_||_\___/\__,_/__/
		// 
		/**
			@method selection
			@return {String} the currently selected text
		*/
		selection: function() {

			var ctxt = this,
				o = ctxt.options,
				el = ctxt.element;

			var words = el.data("ui-jselection").words.filter("." + o.selectedClass).text();
			return words;

		},



		//                  _     _                 _ _            
		//  _____ _____ _ _| |_  | |_  __ _ _ _  __| | |___ _ _ ___
		// / -_) V / -_) ' \  _| | ' \/ _` | ' \/ _` | / -_) '_(_-<
		// \___|\_/\___|_||_\__| |_||_\__,_|_||_\__,_|_\___|_| /__/
		// 
		handlers: {

			/**
				Handle the beginning of text selection in the element
				@method _mousedown
				@private
			*/
			_mousedown: function(event) {

				var el = $(this);

				// Only left click!
				if (event.which !== 1) {
					return;
				}

				var tag = el.jselection("option", "tag");

				var words = el.data("ui-jselection").words;

				// Extend the selection if shift is held down
				// Otherwise start a new selection
				if (event.shiftKey) {
					words.filter(".selected").addClass("active").removeClass("selected");
				} else {
					words.removeClass("selected").removeClass('first');
				}

				// On hover, begin selection.. bind the mouseenter event on the child tags.
				el.on("mouseenter", tag, function() {

					// The .first class helps us know which way the selection should grow.
					// Add the class if it's not present.
					if (words.filter(".first").size() === 0) {
						$(this).addClass("first").addClass("active");
					} else {

						// This is where the selection grows.
						// Add the active class to our current target.
						$(this).addClass("active");

						// Find the 'first' selected entity
						var firstIndex = words.index(words.filter(tag).filter('.first'));

						// Find the index of our currently selected entity
						var myIndex = words.index($(this));

						// Calculate the relative difference
						var diff = myIndex - firstIndex;

						// We are further along in the text flow
						// Grow the selection with some creative array operations.
						if (diff > 0) {
							words.slice(firstIndex, myIndex).addClass("active");
							words.slice(0, Math.max(0, firstIndex - 1)).removeClass("active");

							if (myIndex < words.size()) {
								words.slice(myIndex + 1, words.size()).removeClass("active");
							}
						} else {
							// Or we are behind where we started.
							// Reverse the selection
							words.slice(myIndex, firstIndex).addClass("active");
							words.slice(firstIndex + 1, words.size() - 1).removeClass("active");
							if (myIndex > 0) {
								words.slice(0, myIndex - 1).removeClass("active");
							}
						}
					}

				});
			},

			/**
				Handle the end of text selection in the element
				@method _mouseup
				@private
			*/
			_mouseup: function(event) {

				var el = $(this);

				var tag = el.jselection("option", "tag");

				// Only left click!
				if (event.which !== 1) {
					return;
				}

				// Undo all the events we bound in the mousedown handler!
				el.off("mouseenter", tag);

				// Make selected words actually 'active' now
				var words = el.data("ui-jselection").words;
				words.filter(".active").addClass('selected').removeClass("active");

			}

		},

		//       _   _ _ _ _   _        
		//  _  _| |_(_) (_) |_(_)___ ___
		// | || |  _| | | |  _| / -_|_-<
		//  \_,_|\__|_|_|_|\__|_\___/__/
		// 
		util: {
			/**
				Add the necessary markup to enable selection via JS.
				@method _wrapTokens
				@private
			*/
			_wrapTokens: function(elem, tag) {

				// Not very pretty, but that's what you get when you try to implement
				// low-level system interactions in JS.
				elem.children().andSelf().contents().each(function() {
					if (this.nodeType === 3) { // TEXT_NODE (http://www.javascriptkit.com/domref/nodetype.shtml)
						var $this = $(this);
						// TODO: Have this wrap word tokens or characters
						$this.replaceWith($this.text().replace(/\s+/g, ' ').replace(/(.)/g, "<" + tag + ">$&</" + tag + " >"));
					}

				});
			}

		},

		//     _        _                
		//  __| |___ __| |_ _ _ ___ _  _ 
		// / _` / -_|_-<  _| '_/ _ \ || |
		// \__,_\___/__/\__|_| \___/\_, |
		//                          |__/   

		/**
			Destroy the widget and restore to original state.
			@method _mousedown
			@private
		*/
		destroy: function() {

			var ctxt = this,
				el = ctxt.element;

			// unbind handlers by name
			el.unbind("mousedown", ctxt.handlers._mousedown).unbind("mouseup", ctxt.handlers._mouseup);

			// restore original HTML
			el.html(el.data("ui-jselection").html);

			// Remove widget data
			el.removeData("ui-jselection");
			el.removeClass("ui-jselection");

			// Restore selection
			el.enableSelection();

			// call _super just for fun!
			ctxt._super();

		}


	});


})(jQuery);