// Mobile sidebar toggle
(function(){
  var btn = document.getElementById('sidebar-toggle');
  var sidebar = document.querySelector('.saint-sidebar');
  if (!btn || !sidebar) return;
  btn.addEventListener('click', function(){
    sidebar.classList.toggle('open');
    btn.textContent = sidebar.classList.contains('open') ? '✕' : '☰';
  });
  document.addEventListener('click', function(e){
    if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== btn) {
      sidebar.classList.remove('open');
      btn.textContent = '☰';
    }
  });
})();
