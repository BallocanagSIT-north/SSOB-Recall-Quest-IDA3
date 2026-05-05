export const menuItems = ["Dashboard", "Flashcards", "Quiz", "Rankings", "Search", "About"];
export const difficulties = ["Easy", "Medium", "Hard"];
export const xpPerCorrectAnswer = {
  Easy: 10,
  Medium: 15,
  Hard: 25,
};
export const perfectBonusXp = 100;
export const maxLevel = 50;
export const xpPerLevel = 250;

export const moduleBank = [
  {
    module: "Module 1",
    topic: "Networking Today",
    cards: [
      ["Network", "A group of devices connected so they can share data and resources."],
      ["End device", "A device used by people, such as a PC, phone, printer, or server."],
    ],
    questions: [
      ["Easy", "What is the main purpose of a computer network?", ["To share data and resources", "To remove all security risks", "To replace operating systems", "To stop internet access"], 0, "Networks let devices communicate and share resources such as files, printers, and internet access."],
      ["Medium", "Which device is considered an end device?", ["Router", "Switch", "Laptop", "Wireless access point"], 2, "A laptop is an end device because it is used directly by a user to send or receive data."],
      ["Hard", "Why is network reliability important in modern organizations?", ["It makes cables shorter", "It keeps services available when users need them", "It removes the need for addressing", "It prevents every attack automatically"], 1, "Reliable networks reduce downtime so users can keep accessing applications, data, and services."],
    ],
  },
  {
    module: "Module 2",
    topic: "Basic Switch and End Device Configuration",
    cards: [
      ["Hostname", "The configured name used to identify a network device."],
      ["Default gateway", "The router address a host uses to reach remote networks."],
    ],
    questions: [
      ["Easy", "Which command prompt mode is used for basic viewing commands on Cisco IOS?", ["User EXEC", "Global configuration", "Interface configuration", "ROMMON"], 0, "User EXEC mode gives limited access for basic monitoring commands."],
      ["Medium", "What setting lets a host send traffic to networks outside its local LAN?", ["DNS server", "Default gateway", "Console password", "Hostname"], 1, "The default gateway is the router interface used to forward traffic to remote networks."],
      ["Hard", "Why should device configuration be saved after changes?", ["Running configuration is lost after reload", "It changes copper to fiber", "It deletes passwords", "It disables SSH"], 0, "Cisco IOS keeps active changes in running-config, which must be saved to startup-config to survive a reload."],
    ],
  },
  {
    module: "Module 3",
    topic: "Protocols and Models",
    cards: [
      ["Protocol", "A rule or standard that controls how network communication works."],
      ["Encapsulation", "The process of adding protocol headers and trailers to data."],
    ],
    questions: [
      ["Easy", "What does a network protocol define?", ["Communication rules", "Monitor size", "Keyboard layout", "Power outlet type"], 0, "Protocols define rules such as message format, timing, delivery, and error handling."],
      ["Medium", "What happens during encapsulation?", ["Headers are added as data moves down the stack", "IP addresses are erased", "Switches create passwords", "Applications stop sending data"], 0, "Each layer adds its own control information so the receiving device can process the message."],
      ["Hard", "Why are layered models useful?", ["They make every device wireless", "They divide communication into understandable parts", "They remove all routing", "They require one vendor"], 1, "Layered models help people design, troubleshoot, and explain network communication by separating responsibilities."],
    ],
  },
  {
    module: "Module 4",
    topic: "Physical Layer",
    cards: [
      ["Bandwidth", "The capacity of a medium to carry data."],
      ["UTP", "Unshielded twisted-pair copper cable commonly used in Ethernet LANs."],
    ],
    questions: [
      ["Easy", "Which layer sends bits across cables, fiber, or wireless signals?", ["Application", "Physical", "Transport", "Session"], 1, "The Physical layer represents data as electrical, optical, or radio signals."],
      ["Medium", "Which medium uses light pulses to carry data?", ["Fiber-optic cable", "Coaxial cable", "UTP cable", "Serial cable"], 0, "Fiber-optic cable sends data as light, which allows long distances and resistance to electromagnetic interference."],
      ["Hard", "Why can wireless communication be less predictable than wired media?", ["It never uses standards", "Signals can be affected by interference and obstacles", "It has no frames", "It cannot use encryption"], 1, "Wireless signals share open air and can be weakened by walls, distance, and competing radio sources."],
    ],
  },
  {
    module: "Module 5",
    topic: "Number Systems",
    cards: [
      ["Binary", "A base-2 number system using 0 and 1."],
      ["Hexadecimal", "A base-16 number system often used to shorten binary values."],
    ],
    questions: [
      ["Easy", "Which number system uses only 0 and 1?", ["Decimal", "Binary", "Hexadecimal", "Octal"], 1, "Binary uses two symbols, 0 and 1, matching how computers represent bits."],
      ["Medium", "What decimal value is binary 00001010?", ["8", "10", "12", "16"], 1, "Binary 00001010 has the 8 and 2 positions turned on, which equals 10."],
      ["Hard", "Why is hexadecimal useful in networking?", ["It shortens long binary values", "It replaces IP addressing", "It prevents loops", "It encrypts all traffic"], 0, "Hexadecimal gives a compact way to write binary-heavy values such as IPv6 addresses and MAC addresses."],
    ],
  },
  {
    module: "Module 6",
    topic: "Data Link Layer",
    cards: [
      ["Frame", "A Data Link layer unit that carries data across a local link."],
      ["MAC address", "A hardware address used for local Ethernet delivery."],
    ],
    questions: [
      ["Easy", "What is the Data Link layer PDU called?", ["Bit", "Frame", "Packet", "Segment"], 1, "The Data Link layer packages data into frames for delivery over a local medium."],
      ["Medium", "What kind of address is used for local frame delivery?", ["MAC address", "Port number", "Domain name", "URL"], 0, "MAC addresses identify network interfaces on the local network segment."],
      ["Hard", "What does trailer information in a frame commonly help detect?", ["Transmission errors", "Usernames", "Default gateways", "DNS names"], 0, "Frame trailers often include error-checking values such as the FCS."],
    ],
  },
  {
    module: "Module 7",
    topic: "Ethernet Switching",
    cards: [
      ["Switch", "A LAN device that forwards frames based on MAC addresses."],
      ["MAC table", "A table that maps learned MAC addresses to switch ports."],
    ],
    questions: [
      ["Easy", "Which address does a switch learn?", ["MAC address", "DNS name", "URL", "Subnet mask"], 0, "Switches learn source MAC addresses and associate them with incoming ports."],
      ["Medium", "What does a switch do with an unknown unicast frame?", ["Floods it out other ports", "Always drops it", "Changes it to IPv6", "Sends it to DNS"], 0, "If the destination MAC is unknown, the switch floods the frame except out the port it arrived on."],
      ["Hard", "Which table does a switch use to make forwarding decisions?", ["MAC address table", "Routing table", "ARP cache only", "DNS zone"], 0, "The MAC address table tells the switch which port should receive traffic for a known MAC address."],
    ],
  },
  {
    module: "Module 8",
    topic: "Network Layer",
    cards: [
      ["Packet", "A Network layer unit that contains source and destination IP addresses."],
      ["Router", "A device that forwards packets between different networks."],
    ],
    questions: [
      ["Easy", "Which device forwards traffic between different IP networks?", ["Router", "Hub", "Monitor", "Patch panel"], 0, "Routers connect networks and make forwarding decisions using IP addresses."],
      ["Medium", "Which address is used at the Network layer?", ["IP address", "MAC address only", "Port number", "SSID"], 0, "The Network layer uses logical IP addresses to deliver packets between networks."],
      ["Hard", "What does a router do when no route matches a packet destination?", ["Drops it unless a default route exists", "Turns it into a frame", "Sends it to every switch port", "Changes the source IP"], 0, "A router needs a matching route or default route; otherwise it cannot forward the packet."],
    ],
  },
  {
    module: "Module 9",
    topic: "Address Resolution",
    cards: [
      ["ARP", "A protocol that maps IPv4 addresses to MAC addresses on a local network."],
      ["Neighbor Discovery", "IPv6 processes that discover addresses and routers on a local link."],
    ],
    questions: [
      ["Easy", "What does ARP discover?", ["The MAC address for an IPv4 address", "A website password", "A wireless channel", "A transport port"], 0, "ARP resolves a known IPv4 address to the MAC address needed for local frame delivery."],
      ["Medium", "When does a host use the gateway MAC address?", ["When sending to a remote network", "When sending to itself", "When changing its hostname", "When opening a text file"], 0, "For remote destinations, the frame goes to the default gateway MAC address."],
      ["Hard", "Which IPv6 feature replaces ARP behavior?", ["Neighbor Discovery", "NAT overload", "STP", "FTP"], 0, "IPv6 uses Neighbor Discovery messages instead of ARP for local address resolution."],
    ],
  },
  {
    module: "Module 10",
    topic: "Basic Router Configuration",
    cards: [
      ["Router interface", "A router connection that belongs to a specific network."],
      ["Static route", "A manually configured route to a destination network."],
    ],
    questions: [
      ["Easy", "What must a router interface usually have before forwarding IPv4 traffic?", ["An IP address and active status", "A web browser", "A printer name", "A spreadsheet"], 0, "Router interfaces need correct IP settings and must be enabled to forward traffic."],
      ["Medium", "Which command commonly enables a Cisco router interface?", ["no shutdown", "enable secret", "show clock", "copy run start"], 0, "The no shutdown command administratively enables an interface."],
      ["Hard", "Why configure a default route on a small router?", ["To send unknown remote traffic toward an upstream router", "To erase VLANs", "To create a MAC address", "To replace DNS"], 0, "A default route provides a fallback path for destinations not listed more specifically."],
    ],
  },
  {
    module: "Module 11",
    topic: "IPv4 Addressing",
    cards: [
      ["Subnet mask", "A value that separates the network and host parts of an IPv4 address."],
      ["Broadcast address", "An address used to reach all hosts in an IPv4 subnet."],
    ],
    questions: [
      ["Easy", "How many bits are in an IPv4 address?", ["32", "64", "96", "128"], 0, "IPv4 addresses are 32 bits long, usually written in dotted decimal format."],
      ["Medium", "Which address type reaches all hosts in one IPv4 subnet?", ["Broadcast", "Unicast", "Loopback only", "Multicast only"], 0, "An IPv4 broadcast is delivered to every host in the local subnet."],
      ["Hard", "How many usable host addresses are in a /26 IPv4 subnet?", ["30", "62", "126", "254"], 1, "A /26 has 64 total addresses. Subtract network and broadcast addresses to get 62 usable hosts."],
    ],
  },
  {
    module: "Module 12",
    topic: "IPv6 Addressing",
    cards: [
      ["IPv6", "A 128-bit addressing system written in hexadecimal."],
      ["Link-local address", "An IPv6 address used on the local link, commonly starting with FE80."],
    ],
    questions: [
      ["Easy", "How many bits are in an IPv6 address?", ["32", "48", "64", "128"], 3, "IPv6 addresses are 128 bits long."],
      ["Medium", "Which IPv6 prefix commonly identifies a link-local address?", ["FE80::/10", "192.168.0.0/16", "10.0.0.0/8", "FF00::/8 only"], 0, "IPv6 link-local addresses commonly begin with FE80 and are used on the local link."],
      ["Hard", "Why can IPv6 addresses be shortened with ::?", ["It replaces one continuous group of zero hextets", "It removes all host bits", "It turns IPv6 into IPv4", "It disables routing"], 0, "The double colon compresses one continuous run of zero hextets to make IPv6 notation shorter."],
    ],
  },
  {
    module: "Module 13",
    topic: "ICMP",
    cards: [
      ["ICMP", "A protocol used for network messages, errors, and testing."],
      ["Ping", "A tool that sends ICMP Echo Requests to test reachability."],
    ],
    questions: [
      ["Easy", "Which tool commonly tests network reachability with ICMP?", ["ping", "format", "paint", "rename"], 0, "Ping uses ICMP Echo Request and Echo Reply messages to test whether a device is reachable."],
      ["Medium", "What can traceroute help identify?", ["The path packets take", "A user's favorite browser", "A cable color", "A password length"], 0, "Traceroute shows the sequence of routers along the path to a destination."],
      ["Hard", "What does an ICMP destination unreachable message indicate?", ["A device cannot deliver the packet", "A switch learned a MAC", "A password changed", "A file was compressed"], 0, "Destination unreachable messages report that delivery failed for a specific reason."],
    ],
  },
  {
    module: "Module 14",
    topic: "Transport Layer",
    cards: [
      ["TCP", "A reliable Transport layer protocol."],
      ["UDP", "A faster, connectionless Transport layer protocol."],
    ],
    questions: [
      ["Easy", "Which Transport layer protocol is connection-oriented?", ["TCP", "UDP", "IP", "ARP"], 0, "TCP establishes a connection and provides reliable delivery features."],
      ["Medium", "Why might an application use UDP?", ["Lower overhead and faster delivery", "Guaranteed retransmission", "MAC learning", "Subnet masking"], 0, "UDP has less overhead and is useful for traffic that values speed, such as voice or video."],
      ["Hard", "What do port numbers identify?", ["Specific applications or services on a host", "Only physical cables", "Only MAC vendors", "Only wireless channels"], 0, "Port numbers let transport protocols deliver data to the correct application process."],
    ],
  },
  {
    module: "Module 15",
    topic: "Application Layer",
    cards: [
      ["DNS", "An application service that resolves names to IP addresses."],
      ["HTTP", "A protocol used to transfer web content."],
    ],
    questions: [
      ["Easy", "Which protocol is used to load web pages?", ["HTTP", "ARP", "ICMP", "STP"], 0, "HTTP and HTTPS are used by browsers and web servers to exchange web content."],
      ["Medium", "What does DNS do for users?", ["Translates names into IP addresses", "Assigns switch ports", "Builds frames", "Counts hops"], 0, "DNS lets users type names instead of memorizing IP addresses."],
      ["Hard", "Which protocol is commonly used to securely transfer web traffic?", ["HTTPS", "Telnet", "TFTP", "ARP"], 0, "HTTPS protects web traffic by using encryption with HTTP."],
    ],
  },
  {
    module: "Module 16",
    topic: "Network Security Fundamentals",
    cards: [
      ["CIA triad", "Confidentiality, Integrity, and Availability."],
      ["Least privilege", "Giving users only the access they need to do their work."],
    ],
    questions: [
      ["Easy", "What is the purpose of authentication?", ["Verify identity", "Shorten cables", "Assign DNS names", "Count frames"], 0, "Authentication confirms that a user or device is who it claims to be."],
      ["Medium", "Which part of the CIA triad protects data from unauthorized viewing?", ["Confidentiality", "Integrity", "Availability", "Latency"], 0, "Confidentiality focuses on preventing unauthorized access to information."],
      ["Hard", "Why is least privilege important?", ["It limits damage if an account is misused", "It increases broadcast traffic", "It disables routing", "It removes passwords"], 0, "Least privilege reduces risk by limiting what each account can access or change."],
    ],
  },
  {
    module: "Module 17",
    topic: "Build a Small Network",
    cards: [
      ["Troubleshooting", "A structured process for finding and fixing network problems."],
      ["Baseline", "A record of normal network behavior used for comparison."],
    ],
    questions: [
      ["Easy", "What is a good first step when troubleshooting?", ["Identify the problem", "Replace every device", "Erase all settings", "Ignore symptoms"], 0, "Troubleshooting starts by identifying the problem and gathering symptoms."],
      ["Medium", "Why is documentation useful in a small network?", ["It makes settings easier to verify and restore", "It blocks all traffic", "It replaces cables", "It removes users"], 0, "Documentation records IP addresses, device names, ports, and changes so support is easier."],
      ["Hard", "What does a network baseline help you do?", ["Compare current behavior with normal behavior", "Disable every protocol", "Change binary to decimal", "Remove the gateway"], 0, "A baseline gives you normal performance and configuration references for troubleshooting."],
    ],
  },
];

export const quizTargets = {
  Easy: 10,
  Medium: 15,
  Hard: 25,
};

export const studyGroups = [
  {
    id: "modules-1-5",
    title: "Modules 1-5",
    desc: "Networking Today, IOS basics, protocols, physical layer, and number systems.",
    start: 1,
    end: 5,
  },
  {
    id: "modules-6-10",
    title: "Modules 6-10",
    desc: "Data link, Ethernet switching, network layer, address resolution, and router basics.",
    start: 6,
    end: 10,
  },
  {
    id: "modules-11-17",
    title: "Modules 11-17",
    desc: "IPv4, IPv6, ICMP, transport, applications, security, and small networks.",
    start: 11,
    end: 17,
  },
];

export const moduleNumber = (item) => Number(item.module.replace("Module ", ""));

export const toQuestion = (item, [difficulty, question, options, answer, explanation]) => ({
  difficulty,
  question: `${item.module}: ${question}`,
  options,
  answer,
  explanation,
});

export const makeConceptQuestions = (modules, difficulty) => {
  const cards = modules.flatMap((item) =>
    item.cards.map(([front, back]) => ({
      module: item.module,
      topic: item.topic,
      front,
      back,
    }))
  );

  if (difficulty === "Hard") {
    return cards.flatMap((card, index) => {
      const wrongCards = cards.filter((item) => item.front !== card.front);
      const wrongOptions = [0, 1, 2].map(
        (offset) => wrongCards[(index + offset) % wrongCards.length]
      );

      return [
        {
          difficulty,
          question: `${card.module}: In a troubleshooting scenario, why does ${card.front} matter?`,
          options: [
            card.back,
            wrongOptions[0].back,
            "It is only used to decorate the network diagram.",
            "It removes the need to understand addressing and protocols.",
          ],
          answer: 0,
          explanation: `${card.front} matters because ${card.back.toLowerCase()}`,
        },
        {
          difficulty,
          question: `${card.module}: Which concept would best help with this task: ${card.back}`,
          options: [
            card.front,
            wrongOptions[0].front,
            wrongOptions[1].front,
            wrongOptions[2].front,
          ],
          answer: 0,
          explanation: `${card.front} is the best match because it means: ${card.back}`,
        },
      ];
    });
  }

  return cards.map((card, index) => {
    const wrongCards = cards.filter((item) => item.front !== card.front);
    const wrongOptions = [0, 1, 2].map(
      (offset) => wrongCards[(index + offset) % wrongCards.length]
    );

    if (difficulty === "Easy") {
      return {
        difficulty,
        question: `${card.module}: Which description best matches ${card.front}?`,
        options: [card.back, ...wrongOptions.map((item) => item.back)],
        answer: 0,
        explanation: `${card.front} means: ${card.back}`,
      };
    }

    if (difficulty === "Medium") {
      return {
        difficulty,
        question: `${card.module}: Which term matches this description: ${card.back}`,
        options: [card.front, ...wrongOptions.map((item) => item.front)],
        answer: 0,
        explanation: `The correct term is ${card.front}. This concept belongs to ${card.topic}.`,
      };
    }

    return {
      difficulty,
      question: `${card.module}: Which term matches this description: ${card.back}`,
      options: [card.front, ...wrongOptions.map((item) => item.front)],
      answer: 0,
      explanation: `The correct term is ${card.front}. This concept belongs to ${card.topic}.`,
    };
  });
};

export const makeQuestionSet = (modules) => {
  const sourceQuestions = modules.flatMap((item) => item.questions.map((question) => toQuestion(item, question)));

  return difficulties.flatMap((difficulty) => {
    const directQuestions = sourceQuestions.filter((question) => question.difficulty === difficulty);
    const conceptQuestions = makeConceptQuestions(modules, difficulty);
    const mixedQuestions = [...directQuestions, ...conceptQuestions];
    const target = quizTargets[difficulty];

    return Array.from({ length: target }, (_, index) => ({
      ...mixedQuestions[index % mixedQuestions.length],
      id: `${difficulty}-${index}`,
    }));
  });
};

export const quizTopics = studyGroups.map((group) => {
  const modules = moduleBank.filter((item) => {
    const number = moduleNumber(item);
    return number >= group.start && number <= group.end;
  });

  return {
    title: `${group.title} Quiz`,
    desc: group.desc,
    questions: makeQuestionSet(modules),
  };
});

export const builtInFlashcards = studyGroups.map((group) => {
  const modules = moduleBank.filter((item) => {
    const number = moduleNumber(item);
    return number >= group.start && number <= group.end;
  });

  return {
    ...group,
    cards: modules.flatMap((item) =>
      item.cards.map(([front, back]) => ({
        id: `${item.module}-${front}`,
        module: item.module,
        front,
        back,
        source: "Built-in",
      }))
    ),
  };
});

export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
};

export const createId = (prefix) => {
  if (window.crypto?.randomUUID) {
    return `${prefix}-${window.crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}`;
};

export const isBetterAttempt = (nextAttempt, currentBest) => {
  if (!currentBest) {
    return true;
  }

  const nextPercent = nextAttempt.score / nextAttempt.total;
  const bestPercent = currentBest.score / currentBest.total;

  return (
    nextPercent > bestPercent ||
    (nextPercent === bestPercent && nextAttempt.timeUsed < currentBest.timeUsed)
  );
};

export const getLevelInfo = (xp) => {
  const level = Math.min(maxLevel, Math.floor(xp / xpPerLevel) + 1);
  const currentLevelXp = (level - 1) * xpPerLevel;
  const nextLevelXp = level >= maxLevel ? currentLevelXp : level * xpPerLevel;
  const xpIntoLevel = Math.max(0, xp - currentLevelXp);
  const xpNeeded = Math.max(1, nextLevelXp - currentLevelXp);

  return {
    level,
    xpIntoLevel,
    xpNeeded,
    progress: level >= maxLevel ? 100 : Math.min(100, Math.round((xpIntoLevel / xpNeeded) * 100)),
  };
};

export const makeDefaultProfile = (username = "Guest") => ({
  username,
  xp: 0,
  achievements: [],
  attempts: [],
});

export const loadSavedUsers = () => {
  try {
    const savedUsers = JSON.parse(window.localStorage.getItem("recallQuestUsers")) || {};
    const oldProfile = JSON.parse(window.localStorage.getItem("recallQuestProfile"));

    if (oldProfile?.username && !savedUsers[oldProfile.username]) {
      return { ...savedUsers, [oldProfile.username]: oldProfile };
    }

    return savedUsers;
  } catch {
    return {};
  }
};
