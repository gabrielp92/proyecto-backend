const graphql = require('graphql')
const {buildSchema}  = graphql

const schemaProduct = buildSchema(`
    type ProductoDTO {
        nombre : String,
        descripcion : String,
        código : Int,
        stock : Int,
        precio : Int,
        foto : String,
        timestamp : Date,
        _id : ID!
    }

    input ProductoInput {
        nombre : String,
        descripcion : String,
        código : Int,
        stock : Int,
        precio : Int,
        foto : String
    }

    type Query {
        getProductController(id: ID): [ProductoDTO],  
    }

    type Mutation {
        postProductController(data: ProductoInput): ProductoDTO,
        putProductController(id:ID!, data:ProductoInput) ProductoDTO,
        deleteProductController(id:ID!): ProductoDTO
    }
`)

module.exports = schemaProduct