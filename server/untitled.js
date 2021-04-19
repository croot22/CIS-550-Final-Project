

	submitcategory() {
		let category = this.state.selectedCategory;
		let url = new URL('http://localhost:8081/yelp/zipcode/15222/weekday/3/hour/5/cusine/');
		let queryParams = {category: category};
		Object.keys(queryParams).forEach(key => url.searchParams.append(key, queryParams[key]));
		fetch(url, {
			method: 'GET'
		}).then(res => {
			return res.json();
		}, err => {
			return console.log(err);
		}).then(restaurantList => {
			let restaurantDivs = restaurantList.map((restaurant, i) => 
				<restaurantRow restaurant={restaurant} />
			); 

			this.setState({
				recRestaurants: restaurantDivs
			});
		});
	}

