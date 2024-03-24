export const formatDate = (inputDate)=> {
    const date = new Date(inputDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
}

export const formatDateTime = (inputDate) => {
    const date = new Date(inputDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hour}:${minute}:${seconds}`;
}


export const parseBoolean = (value) => {
    const lowerCaseValue = value.toLowerCase();

    if (lowerCaseValue === 'true') {
        return true;
    } else if (lowerCaseValue === 'false') {
        return false;
    }

    return null;
}

export const priceFormat = (price)=> {
    if(price!=null){
        
        return "£" + parseFloat(price).toFixed(2).toString()
    }
    else{
        return "-"
    }
}

export const isBrowser = () => {
    return typeof window !== "undefined";
}

export const isSmallScreen = () => {
    return isBrowser() && window.innerWidth < 768;
}
  
  