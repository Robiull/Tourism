class APIFeature{
    constructor(query,queryString){
        this.query=query
        this.queryString=queryString
    }
    filter(){
        const queryObj={...this.queryString}
        const excludesFields=['page','sort','fields','limit']
        excludesFields.forEach(el=>delete(queryObj[el]))

        // 1B)Advanced Filtering
        let queryStr=JSON.stringify(queryObj)
        queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match=>`$${match}`)
        this.query=this.query.find(JSON.parse(queryStr))
        return this;
    }
    sort(){
        if(this.queryString.sort){
            const sortBy=this.queryString.sort.split(',').join(' ')
            this.query.sort(sortBy)
        }else{
            this.query.sort('-createdAt')
        }
        return this;
    }
    limitField(){
        if(this.queryString.fields){
            const fields=this.queryString.fields.split(',').join(' ')
            this.query.select(fields)
        }
        else{
            this.query.select('-__v')
        }
        return this;
    }
    paginate(){
        let page=Math.abs(this.queryString.page)||1;
        let limit=Math.abs(this.queryString.limit)||100;
    
        let skip=(page-1)*limit
        this.query=this.query.find().skip(skip).limit(limit)
    
        return this
    
    }
 
 }

 module.exports=APIFeature;