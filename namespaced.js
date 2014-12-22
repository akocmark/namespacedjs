/**
 * NamespacedJS - Namespaced Javascript
 * 
 * Resolves conflicting variable names in a package-driven application
 *
 * @version 0.1
 * @author Mark Augustine Gutierrez <mgutierrez@koodi.ph>
 * @website https://github.com/akocmark/namespacedjs
 * @license MIT
 */
(function() {
	var Namespace = classified({
		/*
		 * Namespaces collection
		 */
		__namespaces : {},

		/*
		 * Register a namespace
		 *
		 * @param string
		 * @param object
		 * @return void
		*/
		set : function(namespace, context) {
			this.__build(namespace, context);
		},

		/*
		 * Use a namespace
		 *
		 * @param string
		 * @return object
		*/
		use : function(namespace) {
			var self = this;

			var names = namespace.split('.');

			var object = self.__namespaces;
			for (var i = 0; i < names.length; i++) {
				object = object[names[i]];
			}

			if (typeof object == 'undefined') {
				throw 'Unable to load namespace:: ' + namespace;
			}

			return object;
		},


		/*
		 * Builds the namespace
		 *
		 * @param string
		 * @param object
		 * @return void
		*/
		__build : function(namespace, context) {
			var self = this;

			// iterate through the namespace context
			self.__iterate(context, function(name, object) {
				// break the namespace keyname
				var names = namespace.split('.');

				// recursively build the namespace
				var temp = {};
				for (var i = 0; i <= names.length; i++) {
					// assign the namespace context at the end of the loop
					if (i == names.length) {
						temp = self.__buildRecursive(temp, name, object)
						break;
					}

					temp = self.__buildRecursive(temp, names[i], {});
				}

				// add namespace to namespaces collection
				self.__namespaces = self.__mergeRecursive(self.__namespaces, temp);
			})
		},

		/*
		 * Recursively build the namespace
		 *
		 * @param object
		 * @param string
		 * @param object
		 * @return object
		*/
		__buildRecursive : function(object, key, value) {
			var self = this;

			// get object keys
			var objectKeys 	= Object.keys(object);

			// if object doesnt have a key
			if (typeof objectKeys[0] == 'undefined') {
				// assign the object value right away
				object[key] = value
			// else continue with the recursion 
			} else {
				object[objectKeys[0]] = self.__buildRecursive(object[objectKeys[0]], key, value);
			}

			return object;
		},

		/*
		 * Recursively merge properties of two objects 
		 *
		 * @param object
		 * @param object
		 * @return object
		*/
		__mergeRecursive : function(obj1, obj2) {
			var self = this;

			for (var p in obj2) {
				try {
					// Property in destination object set; update its value.
					if ( obj2[p].constructor==Object ) {
						obj1[p] = self.__mergeRecursive(obj1[p], obj2[p]);
					} else {
						obj1[p] = obj2[p];
					}
				} catch(e) {
					// Property in destination object not set; create it and set its value.
					obj1[p] = obj2[p];
				}
			}

			return obj1;
		},

		/*
		 * Iterate through an object or array
		 *
		 * @param object||array
		 * @param closure function
		 * @return void
		*/
		__iterate : function(objectArray, fn) {
			var keys = Object.keys(objectArray);

			for (var i = 0; i < keys.length; i++) {
				fn(keys[i], objectArray[keys[i]]);
			}
		}

	})

	/* Instanstiate Class */
	Namespace = Namespace.load();

	/* Plug to window object */
	window.Namespace = Namespace;
})(jQuery);