function handleClickPageing(){
    const pageItemElements = document.querySelectorAll('.page-item:not(.disabled):not(.active):not(.next):not(.pre)')
    console.log(pageItemElements)
    pageItemElements.forEach(page => {
      page.onclick = () => {
        const windowPath = window.location.href
        if(windowPath.includes("&page=")){
          const newPath = windowPath.replace(`&page=${windowPath.charAt(windowPath.length - 1)}`,`&page=${page.innerText}`)
          window.location.replace(newPath)
        }
        else 
          {window.location.replace(windowPath + '&page=' + page.innerText);}
      }
    })
  } 
  
  function handleClickPrePage(){
    const pageActive = document.querySelector('.page-item.active').innerText
    const windowPath = window.location.href
    const preElement = document.querySelector('.page-item.pre')
    if(preElement !== null){
      console.log(preElement)
      preElement.onclick = () => {
        const newPath = windowPath.replace(`&page=${windowPath.charAt(windowPath.length - 1)}`,`&page=${+pageActive - 1}`)
        window.location.replace(newPath)
      }
    }
    const nextElement = document.querySelector('.page-item.next')
    if(nextElement !== null){
      console.log(nextElement)
      nextElement.onclick = () => {
        const newPath = windowPath.replace(`&page=${windowPath.charAt(windowPath.length - 1)}`,`&page=${+pageActive + 1}`)
        window.location.replace(newPath)
      }

    }
  }