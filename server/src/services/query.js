
const DEFAULT_Page = 1;
const DEFAULT_Limit = 0;

function getPagination(query){
    const limit= Math.abs(query.limit)|| DEFAULT_Limit;
    const page = Math.abs(query.page)||DEFAULT_Page;
    const skip = limit * (page-1);
    return {
        skip,
        limit
    }
}

module.exports = {
    getPagination
}