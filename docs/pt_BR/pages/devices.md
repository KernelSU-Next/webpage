# Dispositivos com suporte não oficial

>[!info] INFORMAÇÕES
> Aqui está a lista de dispositivos não oficialmente suportados pelo KernelSU Next.

>[!warning] AVISO
> Nesta página, existem kernels para dispositivos não oficialmente suportados pelo KernelSU Next, mantidos por outros desenvolvedores. Portanto, tenha cuidado com o que você está flashando!

<script setup>
import data from '../repos.json'
</script>

<table>
   <thead>
      <tr>
         <th>Mantenedor</th>
         <th>Repositório</th>
         <th>Dispositivos suportados</th>
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