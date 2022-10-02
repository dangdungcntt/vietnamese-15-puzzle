<script setup lang="ts">
import HomeLayout from '../layouts/HomeLayout.vue';

import how1Image from '../assets/how1.png';
import how2Image from '../assets/how2.png';

</script>
    
<template>
    <HomeLayout>
        <h1 class="text-center">Hướng dẫn</h1>
        <h3><strong>Mục tiêu</strong></h3>
        <p>
            Mục tiêu của trò chơi là sắp xếp các ô số về đúng thứ tự từ bé đến lớn theo chiều trừ trái qua phải và
            từ trên xuống dưới.
        </p>
        <div style="text-align:center;margin: 0.8rem 0 0.8rem;">
            <div><img :src="how1Image" style="max-height: 300px" alt="Trạng thái kết thúc của màn chơi 3x3">
            </div>
            <small class="italic">Hình 1. Trạng thái kết thúc của màn chơi 3x3</small>
        </div>

        <h3><strong>Luật chơi</strong></h3>
        <p>Trên bàn chơi sẽ có 1 ô trống, khi bắt đầu trò chơi, ô trống sẽ ở vị trí trên cùng bên trái.</p>
        <p>Sử dụng các phím mũi tên, hoặc các phím W-S-A-D để di chuyển ô trống đi 1 ô.</p>
        <p>Trên thiết bị di động, click vào các ô để di chuyển ô trống.</p>
        <h4><strong class="italic">Di chuyển hàng loạt</strong></h4>
        <p>Bạn có thể click vào các ô cùng hàng hoặc cùng cột với ô trống để di chuyển ngay đến vị trí mong muốn.
        </p>
        <h4><strong class="italic">Lượt di chuyển</strong></h4>
        <p>Mỗi khi ô trống thay đổi vị trí được tính là 1 lượt di chuyển. Tổng số lượt di chuyển được hiển thị ở góc
            trên bên phải của bàn chơi.</p>

        <h3><strong>Các chế độ chơi</strong></h3>

        <h4>1. Chế độ cổ điển</h4>
        <p>Bàn chơi sẽ là sắp xếp các con số.</p>

        <h4>2. Chế độ ghép hình</h4>
        <p>Các con số ở chế độ cổ điển sẽ được thay bằng các miếng ghép của 1 hình ảnh lớn.</p>
        <div style="text-align:center;margin: 0.8rem 0 0.8rem;">
            <div><img :src="how2Image" style="max-height: 300px" alt="Trạng thái kết thúc của màn chơi 3x3">
            </div>
            <small class="italic">Hình 2. Màn hình chế độ chơi ghép hình</small>
        </div>

        <h4>3. Chế độ thi đấu</h4>
        <p>Sau khi chọn chế độ thi đấu bạn sẽ được chuyển hướng đến 1 bàn chơi đi kèm 1 mã PIN. Chia sẻ link đến bàn
            chơi cho bạn bè để cùng so tài.</p>
        <p>Các bàn chơi nhập cùng 1 mã PIN sẽ bắt đầu với thứ tự các ô số được xáo trộn giống nhau.</p>
        <p class="italic">Lưu ý: Để đảm bảo công bằng, chế độ thi đấu chỉ cho phép việc click để di chuyển với ô
            ngay
            sát ô trống.</p>

        <router-link to="/" class="btn" style="margin-top:1rem;">Quay lại</router-link>
    </HomeLayout>

</template>