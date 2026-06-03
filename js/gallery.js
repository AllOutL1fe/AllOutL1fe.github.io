//подгрузка изображений

function loadGallery(gridId, folder, stack_default) {
    fetch(folder + "/list.json")
        .then(function(r){ return r.json(); })
        .then(function(items){
            var grid = document.getElementById(gridId);
            if(!grid) return;
            grid.innerHTML = "";
            items.forEach(function(item, i){
                var num = String(i+1).padStart(2,"0");
                var stack = item.stack || stack_default;
                var div = document.createElement("div");
                div.className = "gi sq rv";
                div.innerHTML =
                    '<img src="' + folder + '/' + item.file + '" alt="' + num + '" loading="lazy">' +
                    '<div class="gn">' + num + '</div>' +
                    '<div class="gc"><div class="gc-s">' //+ stack +
                    '</div></div>';
                grid.appendChild(div);
            });
            setTimeout(function() {
            if (typeof initReveal === "function") initReveal();
            if (typeof initLightbox === "function") initLightbox(gridId);
            }, 100);
        })
        .catch(function(){ console.log("list.json не найден: " + folder); });
}