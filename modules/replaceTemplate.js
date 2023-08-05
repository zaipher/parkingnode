module.exports = (temp, product) => {
    let output = temp.replace(/{%PARKINGLOCATION%}/g, product.parkingLocation);
    output = output.replace(/{%PARKINGSTATUS%}/g, product.status);
    output = output.replace(/{%PARKINGPRICE%}/g, product.price);
    //output = output.replace(/{%PARKINGQTY%}/g, product.quantity);
    output = output.replace(/{%PARKINGSTART%}/g, product.startDate);
    output = output.replace(/{%PARKINGEND%}/g, product.endDate);
    output = output.replace(/{%PARKINGBUILDING%}/g, product.building);
    //output = output.replace(/{%PARKINGDETAILS%}/g, product.nutrients);
    //output = output.replace(/{%PARKINGDESC%}/g, product.description);
    output = output.replace(/{%PARKINGID%}/g, product.parkingId);

    if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;

}