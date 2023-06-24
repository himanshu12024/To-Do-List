
exports.getDate= function(){

    const today=new Date();
    const options={
        day:"2-digit",
        month:"2-digit",
        year:"2-digit"
    };
    return today.toLocaleDateString("en-US",options);
}

exports.getDateList=function(){

    const today=new Date();
    const options={
        day:"2-digit",
        month:"2-digit",
        year:"2-digit",
    };
    return today.toLocaleDateString("en-US",options);
}
