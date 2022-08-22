declare interface Product {
	id: string;
	attributes: {
		size: number;
		model: string;
		image: {
			data: {
				attributes: {
					url: string;
				};
			};
		};
		brand: {
			data: {
				attributes: {
					name: string;
				};
			};
		};
	};
}
declare interface ProductsData {
	data: Array<Product>;
	meta: {
		pagination: {
			pageCount: number;
			total: number;
		};
	};
}

declare interface Brand {
	id: string;
	attributes: {
		name: string;
		logo: {
			data: {
				attributes: {
					url: string;
				};
			};
		};
	};
}
