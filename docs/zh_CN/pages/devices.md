# 非官方支持设备

>[!info] 信息
> 由其他开发者维护的支持 KernelSU Next 的非 GKI 设备内核

>[!warning] 请注意：
> 这些内核未经过 KernelSU Next 团队审查，请在使用前自行确保其安全性！

<script setup>
import data from '../../repos.json'
</script>

<table>
   <thead>
      <tr>
         <th>维护者</th>
         <th>仓库</th>
         <th>设备支持</th>
      </tr>
   </thead>
   <tbody>
    <tr v-for="repo in data" :key="repo.devices">
        <td><a :href="repo.maintainer_link" target="_blank" rel="noreferrer">{{ repo.maintainer }}</a></td>
        <td><a :href="repo.kernel_link" target="_blank" rel="noreferrer">{{ repo.kernel_name }}</a></td>
        <td>{{ repo.devices }}</td>
    </tr>
   </tbody>
</table>