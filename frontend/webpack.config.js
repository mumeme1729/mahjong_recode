const path=require('path');
const Dotenv = require('dotenv-webpack');
module.exports ={
    entry:{
        bundle:'./src/index.tsx'
    },
    output:{
        path:path.join(__dirname,'dist'),
        filename:'[name].js'
    },
    resolve:{
        extensions:['.tsx','.js','.ts']
    },
    devServer:{
        contentBase:path.join(__dirname,'dist'),
        historyApiFallback: true,
        open:true
    },
    plugins: [
        new Dotenv(),
      ],
    module:{
        rules:[
            {
                loader:'ts-loader',
                test:/\.tsx?$/,
            },
            {
              test: /\.(png|jpg|gif|svg)$/,
              loader: 'file-loader',
              options: {},
          },
            {
                test: /\.css$/,
                use: [
                  'style-loader',
                  {
                    loader: 'css-loader',
                    options: {
                  modules: true
                    }
                  }
                ]
              }

        ]
    }
}