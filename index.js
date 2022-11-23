let following = []

const getFollowing = async () => {
  const url = "https://twitter.com/i/api/1.1/friends/following/list.json?include_profile_interstitial_type=1&include_blocking=1&include_blocked_by=1&include_followed_by=1&include_want_retweets=1&include_mute_edge=1&include_can_dm=1&include_can_media_tag=1&include_ext_has_nft_avatar=1&include_ext_is_blue_verified=1&skip_status=1&cursor=-1&user_id=1318176552652242944&count=20&with_total_count=true"

  const bearerToken = "<<YOUR TOKEN>>"
  const cookie = '<<YOUR COOKIE>>'
  const csrfToken = '<<YOUR CSRF TOKEN>>'
 let headers = {
    "authorization": bearerToken,
    "cookie": cookie,
    "x-csrf-token": csrfToken,
  }
  const res = await fetch(url, {headers})
  const json = await res.json();
  following = json["users"].map(x => x.name)

}

getFollowing();


const input = document.querySelector('[data-testid=SearchBox_Search_Input]')
input.setAttribute('style', "width: 100%; min-width: 50%; border: none; border-radius: 5px;")
const inputParent = input.parentElement

const tokenize = (s) => {
  return s.split(/\s+/).map(x => x.trim())
}

const prependFromElement = () => {
  if (document.querySelector('#from-element')) {
    return;
  }
  const fromStyle = "display: flex; align-items: center; margin: 7px 0; margin-right: 10px; padding: 0 10px; padding-right: 5px; border-radius: 5px; background-color: #1DA1F2; white-space: nowrap; color: white; "
  let fromEl = document.createElement("div")
  fromEl.setAttribute('id', "from-element")
  fromEl.setAttribute('style', fromStyle)
  fromEl.innerText = "from:"

  let removeBtn = document.createElement("button")
  removeBtn.innerText = "❌"
  removeBtn.setAttribute('style',"display: flex; padding: 6px; border: none; background-color: unset; cursor: pointer; font-size: 8px")
  fromEl.appendChild(removeBtn);
  fromEl.onclick = () => fromEl.remove();

  inputParent.insertBefore(fromEl, input)
}

const updateSearchResults = (results) => {
  let resultsEl = document.querySelector("#search-res")
  if (!resultsEl) {
    resultsEl = document.createElement("div")
    resultsEl.setAttribute('id', 'search-res')
    let rect = input.getBoundingClientRect()
    resultsEl.setAttribute('style', `position: absolute;z-index: 1000; background: white; padding: 5px; top: ${rect.bottom}px; left: ${rect.left}px; width: 200px`)
    document.body.appendChild(resultsEl)
  }
  resultsEl.innerHTML = ""
  results.forEach(result => {
    let resultEl = document.createElement("div")
    resultEl.innerText = result
    resultEl.setAttribute('style', 'border: 1px solid black;')
    resultsEl.appendChild(resultEl)
  })

}

input.onkeydown = e => {
    let searchText = e.target.value;
    if (searchText === "" && e.key === "Backspace") {
      document.querySelector('#from-element')?.remove()
      document.querySelector('#search-res')?.remove()
    }
}

input.onkeyup = e => {
    let searchText = e.target.value;
    let tokenized = tokenize(searchText);
    if (tokenized[0] === "from:") {
      // e.target.value = ""
      // can't clear input's value afaik because it's a react controlled component
      // so next best thing is to select all text so the next keypress erases it
      e.target.select();
      prependFromElement();
    }

    if (document.querySelector('#from-element')) {
      let matches = following.filter(x => x.startsWith(input.value))
      updateSearchResults(matches);
    }
}
