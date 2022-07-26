

const remainingCans = (array) => { // Array of total Can given User have

    let totalCanGiven=0, totalCanTaken=0;
    for (let index = 0; index < array.length; index++) {
        const singleObj = array[index];
        totalCanGiven += singleObj.canGivenToUser;
        totalCanTaken += singleObj.canTakenFromUser;
    }
    return {totalCanGiven,totalCanTaken,noOfRemainingCan:totalCanGiven - totalCanTaken};
}
module.exports = remainingCans;