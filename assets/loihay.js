/* loihay.js — mỗi ngày một câu nói hay về việc học, hiện ở cuối trang.
   Cùng một ngày thì mọi em thấy cùng một câu (tính theo giờ Việt Nam). Thầy thêm, bớt câu ở danh sách dưới. */
(function () {
  "use strict";
  const CAU = [
    ["Học, học nữa, học mãi.", "V. I. Lê-nin"],
    ["Non sông Việt Nam có trở nên tươi đẹp hay không, dân tộc Việt Nam có bước tới đài vinh quang để sánh vai với các cường quốc năm châu được hay không, chính là nhờ một phần lớn ở công học tập của các em.", "Chủ tịch Hồ Chí Minh"],
    ["Hiền tài là nguyên khí của quốc gia.", "Thân Nhân Trung"],
    ["Học mà không suy nghĩ thì uổng công, suy nghĩ mà không học thì nguy hiểm.", "Khổng Tử"],
    ["Biết thì nói là biết, không biết thì nói là không biết, thế mới thật là biết.", "Khổng Tử"],
    ["Ba người cùng đi, ắt có người là thầy ta.", "Khổng Tử"],
    ["Gốc của học vấn thì đắng, nhưng quả của nó thì ngọt.", "Aristotle"],
    ["Giáo dục là vũ khí mạnh nhất mà bạn có thể dùng để thay đổi thế giới.", "Nelson Mandela"],
    ["Đầu tư vào tri thức đem lại lợi nhuận cao nhất.", "Benjamin Franklin"],
    ["Thiên tài là một phần trăm cảm hứng và chín mươi chín phần trăm mồ hôi.", "Thomas Edison"],
    ["Điều quan trọng là không ngừng đặt câu hỏi.", "Albert Einstein"],
    ["Tôi không có tài năng gì đặc biệt. Tôi chỉ say mê tò mò.", "Albert Einstein"],
    ["Trí tưởng tượng quan trọng hơn kiến thức.", "Albert Einstein"],
    ["Người chưa từng mắc sai lầm là người chưa từng thử điều gì mới.", "Albert Einstein"],
    ["Nếu tôi nhìn xa hơn người khác, đó là vì tôi đứng trên vai những người khổng lồ.", "Isaac Newton"],
    ["Không có con đường nào dành riêng cho vua chúa để đến với hình học.", "Euclid"],
    ["Toán học là nữ hoàng của các khoa học.", "Carl Friedrich Gauss"],
    ["Trong toán học, nghệ thuật đặt ra câu hỏi có giá trị hơn việc giải nó.", "Georg Cantor"],
    ["Cuốn sách lớn của tự nhiên được viết bằng ngôn ngữ toán học.", "Galileo Galilei"],
    ["Hãy sống như thể ngày mai bạn sẽ chết. Hãy học như thể bạn sẽ sống mãi mãi.", "Mahatma Gandhi"],
    ["Tri thức là sức mạnh.", "Francis Bacon"],
    ["Vì lợi ích mười năm thì phải trồng cây, vì lợi ích trăm năm thì phải trồng người.", "Chủ tịch Hồ Chí Minh"],
    ["Học hỏi là một việc phải tiếp tục suốt đời.", "Chủ tịch Hồ Chí Minh"],
    ["Không có việc gì khó, chỉ sợ lòng không bền; đào núi và lấp biển, quyết chí ắt làm nên.", "Chủ tịch Hồ Chí Minh"],
    ["Đường đi khó, không khó vì ngăn sông cách núi, mà khó vì lòng người ngại núi e sông.", "Nguyễn Bá Học"],
    ["Ngọc không mài không thành đồ quý, người không học không biết đạo lí.", "Kinh Lễ"],
    ["Học như con thuyền đi ngược nước, không tiến ắt sẽ lùi.", "Cổ ngữ Trung Hoa"],
    ["Có công mài sắt, có ngày nên kim.", "Tục ngữ Việt Nam"],
    ["Muốn biết phải hỏi, muốn giỏi phải học.", "Tục ngữ Việt Nam"],
    ["Học thầy không tày học bạn.", "Tục ngữ Việt Nam"],
    ["Hãy cứ khát khao, hãy cứ dại khờ.", "Steve Jobs"]
  ];
  const ngay = Math.floor((Date.now() + 7 * 3600000) / 86400000);    // số ngày theo giờ Việt Nam
  const c = CAU[ngay % CAU.length];
  function ve() {
    const foot = document.querySelector(".foot .wrap");
    if (!foot || document.getElementById("loiHay")) return;
    const el = document.createElement("figure");
    el.className = "loi-hay"; el.id = "loiHay";
    el.innerHTML = `<blockquote></blockquote><figcaption></figcaption>`;
    el.querySelector("blockquote").textContent = "“" + c[0] + "”";
    el.querySelector("figcaption").textContent = "— " + c[1];
    foot.insertBefore(el, foot.firstChild);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ve); else ve();
})();
