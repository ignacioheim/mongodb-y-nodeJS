let products = [];

let len = products.length;

class Product {
    constructor (title, price, thumbnail) {
        this.title = title,
        this.price = price,
        this.thumbnail = thumbnail
    }

    addProducts = () => {
        products.push({
            title: this.title,
            price: this.price,
            thumbnail: this.thumbnail
        })
    }

    addId = () => {
        products.forEach((data, len)=>{
        data.id = len + 1;
        })  
    }
}

//export default {products, len, Product}
export default {products, len, Product}